import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Login } from './Components/Login/login/login';
import { Register } from './Components/Login/register/register';
import { NoPageFound } from './Components/Common/no-page-found/no-page-found';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },

  {
    path:'**',
    component:NoPageFound
  }
];
