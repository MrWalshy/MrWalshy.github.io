import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

export default function BlogPost(props) {

    const { dirId, fileId } = useParams();
    const { isLoaded, loadDirectoryMap, getAllTopics, getFile } = useOutletContext();
    const [hadError, setHadError] = useState(false);

    const [file, setFile] = useState(null);

    useEffect(() => {
        getFile(dirId, fileId)
            .then(file => {
                // managed to get the file, reset error state
                setFile(file);
                setHadError(false);
            })
            .catch(error => {
                setHadError(true);
                console.warn(error);
            });
    }, [dirId, fileId, getFile]);

    console.log(`Directory id was: ${dirId}`);
    console.log(`File id was: ${fileId}`);

    function renderPost() {
        // console.log(`Rendering post: ${JSON.stringify(file)}`);
        if (!file) return <h1>Loading....</h1>;
        if (hadError) return <h1>Error loading page....</h1>;
        return <ReactMarkdown children={file.data} />;
    }

    return (
        <div>
            {renderPost()}
        </div>
    );
}