import { prismaClient } from "../application/database.js"
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/error.js";
import { getValidatedUser, loginUserValidation, registerUserValidation, updateValidatedUser } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const count = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (count === 1) {
        throw new ResponseError(400, "Username already exist");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });
};

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const isValidPassword = await bcrypt.compare(loginRequest.password, user.password);

    if (!isValidPassword) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const token = uuid().toString();

    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });
};

const get = async (username) => {
    username = validate(getValidatedUser, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User is Not Found")
    }

    return user;
}

const update = async (request) => {
    const user = validate(updateValidatedUser, request);

    const countInDatabase = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countInDatabase !== 1) {
        throw new ResponseError(404, "User is Not Found");
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    })

}

const logout = async (username) => {
    username = validate(getValidatedUser, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new ResponseError(404, "User is Not Found");
    }

    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

export default {
    register,
    login,
    get,
    update,
    logout
}