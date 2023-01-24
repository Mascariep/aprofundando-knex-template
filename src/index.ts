import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

// ping - teste
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

//REFATORANDO PARA QUERY BUILDER
// GET BANDS
app.get("/bands", async (req: Request, res: Response) => {
    try {
        //const result = await db.raw(`
        //    SELECT * FROM bands;
        //`)
        const result = await db("bands")
        
        res.status(200).send(result)

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

// POST BANDS
app.post("/bands", async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const name = req.body.name

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' inválido, deve ser string")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' inválido, deve ser string")
        }

        if (id.length < 1 || name.length < 1) {
            res.status(400)
            throw new Error("'id' e 'name' devem possuir no mínimo 1 caractere")
        }

        //await db.raw(`
        //    INSERT INTO bands (id, name)
        //    VALUES ("${id}", "${name}");
        //`)

        const newBand = {
            id: id,
            name: name,
        }
        await db("bands").insert(newBand)

        res.status(200).send("Banda cadastrada com sucesso")

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

// PUT BANDS
app.put("/bands/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newName = req.body.name

        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 1) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 1 caractere")
            }
        }

        //const [ band ] = await db.raw(`
        //    SELECT * FROM bands
        //    WHERE id = "${idToEdit}";
        //`) // desestruturamos para encontrar o primeiro item do array

        const [ band ] = await db("bands").where({id: idToEdit})

        if (band) {
        //     await db.raw(`
        //         UPDATE bands
        //         SET
        //             id = "${newId || band.id}",
        //             name = "${newName || band.name}"
        //         WHERE
        //             id = "${idToEdit}";
        //     `)

        const updatedBand = {
            id: newId || band.id,
            name: newName || band.name
        }

        await db("bands").update(updatedBand).where({ id: idToEdit })

        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })

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

// DELETE BANDS
app.delete("/bands/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        // const band = await db.raw(`
        //     SELECT * FROM bands
        //     WHERE id = "${idToDelete}";
        // `)
        
        // const [ band ] = await db.select("*").from("bands").where({ id: idToDelete })
				
		const [ band ] = await db("bands").where({ id: idToDelete })

        if (!band) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        // await db.raw(`
		    //     DELETE FROM bands
				// 			WHERE id = "${idToDelete}";
        // `)

        // await db.delete().from("bands").where({ id: idToDelete })

		await db("bands").del().where({ id: idToDelete })

        res.status(200).send({ message: "Banda deletada com sucesso" })
        
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

// GET SONGS
app.get("/songs", async (req: Request, res: Response) => {
    try {
        //const result = await db.raw(`
        //    SELECT * FROM songs;
        //`)

        const result = await db("songs")

        res.status(200).send(result)

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

// POST SONGS
app.post("/songs", async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const name = req.body.name
        const bandId = req.body.bandId

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' inválido, deve ser string")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' inválido, deve ser string")
        }

        if (typeof bandId !== "string") {
            res.status(400)
            throw new Error("'bandId' inválido, deve ser string")
        }

        if (id.length < 1 || name.length < 1 || bandId.length < 1) {
            res.status(400)
            throw new Error("'id', 'name' e 'bandId' devem possuir no mínimo 1 caractere")
        }

        //await db.raw(`
        //    INSERT INTO songs (id, name, band_id)
        //    VALUES ("${id}", "${name}", "${bandId}");
        //`)

        const newSong = {
            id: id,
            name: name,
            bandId: bandId
        }
        await db("bands").insert(newSong)

        res.status(200).send("Música cadastrada com sucesso")

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

// PUT SONGS
app.put("/songs/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newName = req.body.name
        const newBandId = req.body.bandId

        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 1) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 1 caractere")
            }
        }

        if (newBandId !== undefined) {

            if (typeof newBandId !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newBandId.length < 1) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 1 caractere")
            }
        }

        //const [ song ] = await db.raw(`
        //    SELECT * FROM songs
        //    WHERE id = "${idToEdit}";
        //`) // desestruturamos para encontrar o primeiro item do array

        const [ song ] = await db("songs").where({id: idToEdit})
        if (song) {
            // await db.raw(`
            //     UPDATE songs
            //     SET
            //         id = "${newId || song.id}",
            //         name = "${newName || song.name}",
            //         band_id = "${newBandId || song.band_id}"
            //     WHERE
            //         id = "${idToEdit}";
            // `)

        const updatedSong = {
            id: newId || song.id,
            name: newName || song.name,
            band_id: newBandId || song.band_id
        }
    
        await db("songs").update(updatedSong).where({ id: idToEdit })

        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })

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

// DELETE SONGS
app.delete("/songs/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        // const song = await db.raw(`
        //     SELECT * FROM songs
        //     WHERE id = "${idToDelete}";
        // `)
        
        // const [ song ] = await db.select("*").from("songs").where({ id: idToDelete })
				
		const [ song ] = await db("songs").where({ id: idToDelete })

        if (!song) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        // await db.raw(`
		    //     DELETE FROM songs
				// 			WHERE id = "${idToDelete}";
        // `)

        // await db.delete().from("songs").where({ id: idToDelete })

		await db("songs").del().where({ id: idToDelete })

        res.status(200).send({ message: "Música deletada com sucesso" })
        
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