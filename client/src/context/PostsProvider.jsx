import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { postsApi, categoriesApi } from '../services/api';

// Initial state
const initialState = {
  posts: [],
  categories: [],
  loading: false,
  error: null,
};

// Actions
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_POST_OPTIMISTIC: 'ADD_POST_OPTIMISTIC',
  ADD_POST_CONFIRMED: 'ADD_POST_CONFIRMED',
  ADD_POST_ROLLBACK: 'ADD_POST_ROLLBACK',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST_OPTIMISTIC: 'DELETE_POST_OPTIMISTIC',
  DELETE_POST_CONFIRMED: 'DELETE_POST_CONFIRMED',
  DELETE_POST_ROLLBACK: 'DELETE_POST_ROLLBACK',
  SET_CATEGORIES: 'SET_CATEGORIES',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, posts: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_POST_OPTIMISTIC:
      return { ...state, posts: [action.payload, ...state.posts] };
    case ACTIONS.ADD_POST_CONFIRMED:
      // replace temp id with server post (action.payload = {tempId, post})
      return {
        ...state,
        posts: state.posts.map(p => p._id === action.payload.tempId ? action.payload.post : p)
      };
    case ACTIONS.ADD_POST_ROLLBACK:
      return { ...state, posts: state.posts.filter(p => p._id !== action.payload) };
    case ACTIONS.UPDATE_POST:
      return { ...state, posts: state.posts.map(p => p._id === action.payload._id ? action.payload : p) };
    case ACTIONS.DELETE_POST_OPTIMISTIC:
      return { ...state, posts: state.posts.filter(p => p._id !== action.payload) };
    case ACTIONS.DELETE_POST_ROLLBACK:
      return { ...state, posts: [action.payload, ...state.posts] }; // re-add
    case ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch posts & categories
  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      dispatch({ type: ACTIONS.FETCH_START });
      try {
        const posts = await postsApi.fetchPosts();
        const cats = await categoriesApi.fetchCategories();
        if (!cancelled) {
          dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: posts });
          dispatch({ type: ACTIONS.SET_CATEGORIES, payload: cats });
        }
      } catch (err) {
        if (!cancelled) dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message || err });
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // Actions exposed to consumers

  const createPost = async (postData) => {
    // optimistic: create a temporary post with a temp id
    const tempId = `temp-${Date.now()}`;
    const tempPost = { ...postData, _id: tempId, createdAt: new Date().toISOString() };
    dispatch({ type: ACTIONS.ADD_POST_OPTIMISTIC, payload: tempPost });

    try {
      // If sending files use FormData; function caller should pass appropriate body.
      const saved = await postsApi.createPost(postData);
      dispatch({ type: ACTIONS.ADD_POST_CONFIRMED, payload: { tempId, post: saved } });
      return saved;
    } catch (err) {
      // rollback
      dispatch({ type: ACTIONS.ADD_POST_ROLLBACK, payload: tempId });
      throw err;
    }
  };

  const updatePost = async (id, postData) => {
    // naive: call server, then update state on success
    const updated = await postsApi.updatePost(id, postData);
    dispatch({ type: ACTIONS.UPDATE_POST, payload: updated });
    return updated;
  };

  const deletePost = async (id) => {
    // optimistic: remove locally first and then call API
    // Save a copy in case rollback needed
    const copy = state.posts.find(p => p._id === id);
    dispatch({ type: ACTIONS.DELETE_POST_OPTIMISTIC, payload: id });
    try {
      await postsApi.deletePost(id);
      // confirmed: nothing else to do
      return true;
    } catch (err) {
      // rollback: re-add
      dispatch({ type: ACTIONS.DELETE_POST_ROLLBACK, payload: copy });
      throw err;
    }
  };

  return (
    <PostsContext.Provider value={{
      posts: state.posts,
      categories: state.categories,
      loading: state.loading,
      error: state.error,
      createPost,
      updatePost,
      deletePost,
      dispatch,
    }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
