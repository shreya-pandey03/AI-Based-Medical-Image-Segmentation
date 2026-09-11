const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };

/*
This file creates an asyncHandler utility that makes handling errors from asynchronous Express route handlers easier.

This is a very common pattern in Node.js + Express backends.

1. The whole idea

Normally, you might have an Express controller like:

const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)


    res.json(user)
}

The problem is that if something goes wrong inside the async function:

const user = await User.findById(...)

the rejected Promise needs to be passed to Express's error-handling middleware.

That's what asyncHandler does automatically.

2. Start from the outside

Your code:

const asyncHandler = (requestHandler) => {

Here, asyncHandler is a function that accepts another function as an argument.

That argument is called:

requestHandler

Think of:

requestHandler

as your actual controller.

For example:

const getUser = async (req, res) => {
    // controller logic
}

You can pass it to:

asyncHandler(getUser)

So:

asyncHandler
     ↓
receives
     ↓
getUser controller


3. It returns another function

Inside:

return (req, res, next) => {

This is important.

asyncHandler doesn't directly execute your controller.

Instead, it returns a new Express-compatible function.

Express expects route handlers to look like:

(req, res, next) => {
    // something
}

So asyncHandler creates exactly that.

You can visualize it as:

asyncHandler(controller)
        ↓
returns
        ↓
(req, res, next) => { ... }
4. Where does req, res, next come from?

These are provided by Express.

req

Request object.

Contains things like:

req.body
req.params
req.query
req.user
res

Response object.

Used to send something back:

res.json(...)
res.status(...)
res.send(...)
next

A function provided by Express that passes control to the next middleware.

Most importantly for this utility:

next(err)

means:

"There was an error. Send this error to Express's error-handling middleware."

5. The important line

Now we reach:

Promise.resolve(requestHandler(req, res, next))

Let's break it down.

First:

requestHandler(req, res, next)

This executes your actual controller.

For example, suppose:

const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)


    res.json(user)
}

and you use:

asyncHandler(getUser)

Then eventually:

requestHandler(req, res, next)

becomes:

getUser(req, res, next)
6. Why Promise.resolve()?

Because an async function always returns a Promise.

For example:

const getUser = async () => {
    return "Piyush"
}

Even though you return:

"Piyush"

the actual result is a:

Promise

So:

getUser()

is essentially:

Promise → "Piyush"

Therefore:

Promise.resolve(requestHandler(req, res, next))

makes sure the result is treated as a Promise.

7. Then .catch()

You have:

.catch((err) => next(err))

This is the main purpose of the entire utility.

If your controller throws an error or its Promise gets rejected:

requestHandler(req, res, next)

the error gets caught here:

.catch((err) => next(err))

And then:

next(err)

passes the error to Express's error middleware.

8. Example

Suppose you have this controller:

const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)


    if (!user) {
        throw new ApiError(404, "User not found")
    }


    res.json(user)
}

Without asyncHandler, you might need:

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)


        if (!user) {
            throw new ApiError(404, "User not found")
        }


        res.json(user)
    } catch (err) {
        next(err)
    }
}

Notice the repetitive:

try {
   ...
} catch(err) {
   next(err)
}

You don't want to write that in every controller.

So you create:

asyncHandler

Then your controller becomes:

const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)


    if (!user) {
        throw new ApiError(404, "User not found")
    }


    res.json(user)
}

And your route:

router.get("/users/:id", asyncHandler(getUser))

Now asyncHandler handles the error automatically.

9. Let's visualize the execution

Suppose you have:

router.get("/users/:id", asyncHandler(getUser))

First:

asyncHandler(getUser)

returns:

(req, res, next) => {
    Promise.resolve(getUser(req, res, next))
        .catch(err => next(err))
}

Then Express calls that returned function:

Express
   ↓
(req, res, next)
   ↓
getUser(req, res, next)
   ↓
Promise
   ↓
 ┌───────────────┐
 │               │
Success        Error
 │               │
 ↓               ↓
res.json()    catch()
                 ↓
              next(err)
                 ↓
          Error middleware

That's the entire concept.

10. Why not just use try/catch?

You absolutely can.

Without this utility:

const createUser = async (req, res, next) => {
    try {
        // logic
    } catch (err) {
        next(err)
    }
}


const deleteUser = async (req, res, next) => {
    try {
        // logic
    } catch (err) {
        next(err)
    }
}


const updateUser = async (req, res, next) => {
    try {
        // logic
    } catch (err) {
        next(err)
    }
}

Lots of repetition.

With asyncHandler:

const createUser = async (req, res) => {
    // logic
}


const deleteUser = async (req, res) => {
    // logic
}


const updateUser = async (req, res) => {
    // logic
}

And:

router.post("/users", asyncHandler(createUser))
router.delete("/users/:id", asyncHandler(deleteUser))
router.patch("/users/:id", asyncHandler(updateUser))

Much cleaner.

11. The last line
export { asyncHandler }

This simply makes asyncHandler available to other files.

So you can import it somewhere else:

import { asyncHandler } from "../utils/asyncHandler.js"

and then:

router.get("/users", asyncHandler(getUsers))


                 asyncHandler
                      ↓
              receives controller
                      ↓
              runs controller
                      ↓
                 Promise
                ↙       ↘
           success      error
              ↓           ↓
          continue     next(err)
                          ↓
                  Express error middleware
 */
