import React from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { request } from "./store/apiSlice.js";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import c from "./c.js";
// components
import PrivateHeader from "./components/PrivateHeader.jsx";
import PublicHeader from "./components/PublicHeader.jsx";
import Footer from "./components/Footer.jsx";

const imports = {
  React,
  useEffect,
  useState,
  Outlet,
  useDispatch,
  useSelector,
  request,
  useParams,
  Link,
  useNavigate,
  io,
  c,
  PrivateHeader,
  PublicHeader,
  Footer,
};

export default imports;
