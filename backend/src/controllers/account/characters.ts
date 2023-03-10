import express, { Request, Response } from "express";
import getCharacterAvatar from "../../gameUtils/characters/getAvatar";
import getBaseStatistics from "../../gameUtils/characters/getBaseStatistics";
import { Character } from "../../schemas/account/characterSchema";
import getUserIdFromToken from "../../utils/getUserIdFromToken";

const router = express.Router();

// POST /api/characters
export const createCharacter = async (req: Request, res: Response) => {
  try {
    // Create new character object
    const character = new Character({
      nickname: req.body.nickname,
      level: 1,
      class: req.body.class,
      levelExperience: 0,
      statistics: getBaseStatistics(req.body.class),
      avatar: getCharacterAvatar(req.body.class),
      owner: getUserIdFromToken(req.headers.authorization), // Set the owner of the character to the authenticated user (implementation of this step is outside the scope of this answer)
    });

    // Save character to the database
    await character.save();

    res.status(200).json(character);
  } catch (err) {
    console.log(err);
    res.status(403).send("Unauthorized");
  }
  // Extract character data from request body
};

export const getCharacterById = async (req: Request, res: Response) => {
  const characterId = req.params.id;

  // Get character by ID
  const character = await Character.findById(characterId);

  if (!character) {
    return res.status(404).json({ message: "Character not found" });
  }

  // Check if authenticated user owns the character (implementation of this step is outside the scope of this answer)
  const userId: any = getUserIdFromToken(req.headers.authorization);
  if (character.owner !== userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.status(200).json(character);
};

export const getUserCharacters = async (req: Request, res: Response) => {
  try {
    const userId: any = getUserIdFromToken(req.headers.authorization);
    const characters = await Character.find({ owner: userId });

    if (characters.length === 0) {
      res.status(200).send([]);
    }  else {
      res.json(characters);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

export default router;
