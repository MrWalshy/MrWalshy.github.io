import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { buildDirectoryMap, buildFileTree } from "../../utils/DirectoryMap";
import Grid, { CardImageHeader, CardTextBody, CardTextHeader, LinkCard } from "../Grid";
import PageHeader from "../header/PageHeader";
import BlogNavBar from "../navigation/BlogNavBar";
// import NavBar from "../navigation/BlogNavBar";

export default function BlogHome(props) {

    const {
        idMap, idMapLoaded,
        getRecentlyCreatedPosts, getCategories
    } = useOutletContext();

    console.log(idMap);

    return (<main>
        <PageHeader value="Blog home" lead="Coffee + Code = <3" />
        <BlogNavBar />
        <div className="centre">
            <h2>Recently posted...</h2>
            <Grid>
                {idMapLoaded && getRecentlyCreatedPosts().map(post => <LinkCard to={`/blog/post/${post.id}`}>
                    <CardImageHeader src="https://via.placeholder.com/500x300" alt="" text={post.alias} />
                    {/* <CardTextBody text={shortLead} /> */}
                </LinkCard>
                )}
            </Grid>
        </div>

        <div className="centre">
            <h2>Categories...</h2>
            <Grid>
                {idMapLoaded && getCategories().map(category => <LinkCard to={`/blog/board/${category.id}`}>
                    {/* <CardImageHeader src="https://via.placeholder.com/500x300" alt="" text={post.alias} /> */}
                    <CardTextHeader text={category.name} />
                    <CardTextBody text={category.description} />
                </LinkCard>
                )}
            </Grid>
        </div>
    </main>);
}