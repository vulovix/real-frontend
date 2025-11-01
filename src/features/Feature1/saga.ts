import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';
import { feature1Api, TodoItem } from './api';
import { addTodo, fetchTodosFailure, fetchTodosStart, fetchTodosSuccess } from './slice';

// Fetch todos saga
function* fetchTodosSaga(): Generator<unknown, void, unknown> {
  try {
    const todos = yield call(feature1Api.fetchTodos);
    yield put(fetchTodosSuccess(todos as TodoItem[]));
  } catch (error) {
    yield put(fetchTodosFailure((error as Error).message));
  }
}

// Create todo saga
function* createTodoSaga(
  action: PayloadAction<Omit<TodoItem, 'id'>>
): Generator<unknown, void, unknown> {
  try {
    const newTodo = yield call(feature1Api.createTodo, action.payload);
    yield put(addTodo(newTodo as TodoItem));
  } catch (error) {
    yield put(fetchTodosFailure(`Failed to create todo: ${(error as Error).message}`));
  }
}

export function* feature1Saga(): Generator<unknown, void, unknown> {
  yield takeEvery(fetchTodosStart.type, fetchTodosSaga);
  yield takeEvery('feature1/createTodo', createTodoSaga);
}
