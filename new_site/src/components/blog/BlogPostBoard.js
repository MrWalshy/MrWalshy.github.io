import { useParams, useOutletContext } from "react-router-dom";
import Grid, { CardImageHeader, LinkCard } from "../Grid";
import PageHeader from "../header/PageHeader";

export default function BlogPostBoard() {

    const {
        idMap, idMapLoaded,
        getDirFromConfig
    } = useOutletContext();

    const { dirId } = useParams();

    return (
        <main>
            {<PageHeader value={idMapLoaded && "All posts for " + idMap.directories[dirId].alias} />}

            <div className="centre">
                <Grid>
                    {idMapLoaded && getDirFromConfig(dirId).files.map(file => (
                        <LinkCard to={`/blog/post/${file.id}`} key={file.id}>
                            <CardImageHeader src="https://via.placeholder.com/500x300" alt="" text={file.alias} />
                        </LinkCard>
                    ))}
                </Grid>
            </div>
        </main>
    );
}