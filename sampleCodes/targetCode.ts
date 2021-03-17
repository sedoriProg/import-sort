import fs from "fs";
import {TopTemplate} from "./components/TopTemplate";
import {getProfileBy} from "./service/profile";
import {SetData} from "./hooks/SetData"
import {getBlogs} from "./service/blogs";
import {ProfileType} from "./types/profile";
import {getCategories} from "./service/categories";
import {BlogItemType} from "./types/blogItem";
import {CategoryType} from "./types/category";
import rl from "readline"

export const targetCode = () => {
    const a = TopTemplate;
    const b = SetData;
    const c = getBlogs;
    const d = getCategories;
    const e = getProfileBy;
    const f = BlogItemType;
    const g = CategoryType;
    const h = ProfileType;
}