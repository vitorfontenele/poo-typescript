import express, {Request, Response} from 'express';
import cors from 'cors';
// import { db } from "./database/BaseDatabase";
import { TVideoDB } from './types';
import { Video } from './models/Video';
import { VideoDatabase } from './database/VideoDatabase';

// Configurando a instância do express
const app = express();
app.use(express.json());
app.use(cors());

// Ping
app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Get all videos
app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string | undefined;
        const videoDatabase = new VideoDatabase();
        // const result: TVideoDB[] = await db("videos").where("title", "LIKE", `%${q}%`);
        const videosDB = await videoDatabase.findVideos(q);

        const videosToDisplay = videosDB.map(video => 
            new Video(
                video.id,
                video.title,
                video.duration,
                video.uploaded_at
            )
        );

        res.status(200).send(videosToDisplay);
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

// Create video
app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body;

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        // const [ videoDBExists ]: TVideoDB[] | undefined[] = await db("videos").where({ id })
        const videoDatabase = new VideoDatabase();
        const videoDBExists = await videoDatabase.findVideoById(id);

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }
        
        if (typeof title !== "string"){
            res.status(400);
            throw new Error ("'title' deve ser string");
        }

        if (typeof duration !== "number"){
            res.status(400);
            throw new Error ("'duration' deve ser um number");
        }
        if (duration <= 0){
            res.status(400);
            throw new Error ("'duration' deve ser maior do que zero");
        }

        const newVideo = new Video(id, title, duration, new Date().toISOString());

        const newVideoToInsert: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            uploaded_at: newVideo.getUploadedAt()
        };     

        // await db("videos").insert(newVideoToInsert);
        await videoDatabase.insertVideo(newVideoToInsert);

        res.status(201).send({
            message: "Vídeo criado com sucesso",
            video: newVideo
        });
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

// Edit video
app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id;
        const newId = req.body.id;
        const newTitle = req.body.title;
        const newDuration = req.body.duration;

        // Definir fora dos if's
        const videoDatabase = new VideoDatabase();

        if (newId !== undefined){
            if (typeof newId !== "string") {
                res.status(400);
                throw new Error("'id' deve ser string");
            }
    
            // const [ videoDBExists ]: TVideoDB[] | undefined[] = await db("videos").where({ id: newId });
            const videoDBExists = await videoDatabase.findVideoById(newId);
    
            if (videoDBExists) {
                res.status(400)
                throw new Error("'id' já existe")
            }
        }

        if (newTitle !== undefined){
            if (typeof newTitle !== "string"){
                res.status(400);
                throw new Error ("'title' deve ser string");
            }
        }

        if (newDuration !== undefined){
            if (typeof newDuration !== "number"){
                res.status(400);
                throw new Error ("'duration' deve ser number");
            }
            if (newDuration <= 0){
                res.status(400);
                throw new Error ("'duration' deve ser maior do que zero");
            }
        }

        // const [ videoInDB ]: TVideoDB[] | undefined[] = await db("videos").where({ id: idToEdit });
        const videoInDB = await videoDatabase.findVideoById(idToEdit);

        if (!videoInDB) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        const updatedVideo = new Video(
            newId || videoInDB.id,
            newTitle || videoInDB.title,
            newDuration || videoInDB.duration,
            videoInDB.uploaded_at
        );

        const updatedVideoToInsert : TVideoDB = {
            id: updatedVideo.getId(),
            title: updatedVideo.getTitle(),
            duration: updatedVideo.getDuration(),
            uploaded_at: updatedVideo.getUploadedAt()
        };

        // await db("videos").update(updatedVideoToInsert).where({ id: idToEdit });
        await videoDatabase.updateVideo(idToEdit, updatedVideoToInsert);
        
        res.status(200).send({
            message: "Vídeo editado com sucesso",
            video: updatedVideo
        });
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

// Delete video
app.delete("/videos/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // const [ videoInDB ] : TVideoDB[] | undefined[] = await db("videos").where({ id });
        const videoDatabase = new VideoDatabase();
        const videoInDB = await videoDatabase.findVideoById(id);
        if (!videoInDB){
            res.status(404);
            throw new Error ("Vídeo não encontrado");
        }

        const videoToDelete = new Video (
            videoInDB.id,
            videoInDB.title,
            videoInDB.duration,
            videoInDB.uploaded_at
        );

        // await db("videos").del().where({ id });
        await videoDatabase.deleteVideo(id);

        res.status(200).send({
            message: "Vídeo deletado com sucesso",
            video: videoToDelete
        });


    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.listen(3003, () => {
    console.log("Servidor rodando!");
});
