"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "./api";
import { AppDispatch } from "../store";

export function usePrefetchInit() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(api.util.prefetch("getProjects", {}));
    dispatch(api.util.prefetch("getEvents", { query: "featured=true" }));
    dispatch(api.util.prefetch("getSeminars", { query: "featured=true" }));
    dispatch(api.util.prefetch("getMembers", { query: "role=main" }));
  }, []);
}
