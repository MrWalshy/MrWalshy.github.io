import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Blog from "./components/blog/Blog";
import BlogHome from "./components/blog/BlogHome";
import BlogPost from "./components/blog/BlogPost";
import BlogBoard from "./components/blog/BlogBoard";

function AppRouter() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="blog" element={<Blog />}>
                        <Route index element={<BlogHome />} />
                        {/* 
                            BlogBoard and BlogPost will rely on a 'location' query param 
                            which is used to display the relevant information
                            - BlogPost will be markdown pulled from an MD file with fetch() statements
                            - Uses an internal FileTree representation
                        */}
                        <Route path="topic" element={<BlogBoard />} />
                        <Route path="post" element={<BlogPost />} />
                    </Route>
                </Route>
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;