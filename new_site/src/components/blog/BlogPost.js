import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";

export default function BlogPost(props) {

    const { 
        idMap, idMapLoaded,
     } = useOutletContext();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorLoadingFile, setErrorLoadingFile] = useState(false);
    const [file, setFile] = useState(null);
    const [doRenderImage, setDoRenderImage] = useState(false);

    useEffect(() => {
        if (idMap) {
            const file = idMap.files[id];
            if (isImage(file)) {
                setDoRenderImage(true);
                setFile(file);
                setIsLoading(false);
                return;
            }
            
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
    }, [idMapLoaded, id, idMap]);

    function isImage(f) {
        console.log(`Is it PNG: ${f.filetype === "png"}`);
        console.log(f)
        return f.filetype === "png";
    }

    function renderPost() {
        // console.log(`Rendering post: ${JSON.stringify(file)}`);
        // if (isLoading) return <h1>Loading....</h1>;
        // if (errorLoadingFile) return <h1>Error loading post....</h1>;
        return (
            <main>
                <div style={{height: "16px"}}></div>
                {isLoading && <h1>Loading...</h1>}
                {errorLoadingFile && <h1>An error occurred loading the post...</h1>}
                {!doRenderImage && file && <div className="centre"
                     dangerouslySetInnerHTML={{
                        __html: file
                }}></div>}
                {doRenderImage && file && <div className="centre">
                    <h2>{file.alias}</h2>
                    <p>{file.createdAt}</p>
                    <img src={file.href} alt={file.alias} />
                </div>}
                <div style={{height: "16px"}}></div>
            </main>
        );
    }

    return (
        <>
            {renderPost()}
        </>
    );
}