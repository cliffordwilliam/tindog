import React from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { request } from "./store/apiSlice.js";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import io from "socket.io-client";
import c from "./c.js";
import ReCAPTCHA from "react-google-recaptcha";
import hero from "./assets/hero.webp";

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
  GoogleLogin,
  ReCAPTCHA,
  hero,
};

export default imports;
