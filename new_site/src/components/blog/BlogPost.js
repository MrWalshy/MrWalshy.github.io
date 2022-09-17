import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function BlogPost(props) {

    const { 
        config, idMap,
        configLoaded, idMapLoaded,
        errorLoadingConfig, errorLoadingIdMap
     } = useOutletContext();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorLoadingFile, setErrorLoadingFile] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (idMapLoaded) {
            const file = idMap.files[id];
            
            if (file) {
                fetch(file.href)
                .then(response => response.text())
                .then(data => {
                    setIsLoading(false);
                    setFile(data);
                })
                .catch(error => {
                    console.error(error.message);
                    setIsLoading(false);
                    setErrorLoadingFile(true);
                });
            } else {
                setIsLoading(false);
                setErrorLoadingFile(true);
            }
        }
    }, [idMapLoaded]);

    function renderPost() {
        // console.log(`Rendering post: ${JSON.stringify(file)}`);
        if (isLoading) return <h1>Loading....</h1>;
        if (errorLoadingFile) return <h1>Error loading post....</h1>;
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{width: "66%"}} dangerouslySetInnerHTML={{
                    __html: file
                }}>
                    {/* <ReactMarkdown children={file.data} 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]} /> */}
                </div>
            </div>
        );
    }

    return (
        <div>
            {renderPost()}
        </div>
    );
}