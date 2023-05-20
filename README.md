# Basic Mongoose

Mongoose Interface, Schema, Model. Insert data, find data, field filtering. Modular Architecture. Instance method, static method. Mongodb queries, aggregation.

### Query on `users-data.json`, `orders-data.json`, `customers-data.json`

1.  Find all users who are located in New York. <br />
    &rarr;

    ```
    db.getCollection("users-data").find({
        "address.city": "New York"
    });
    ```

2.  Find the user(s) with the email "johndoe@example.com" and retrieve their favorite movie. <br />
    &rarr;

    ```
    db.getCollection("users-data").find({
        email: "johndoe@example.com"
    }).project({
        "favorites.movie": true
    })
    ```

3.  Find all users with "pizza" as their favorite food and sort them according to age. <br />
    &rarr;

    ```
    db.getCollection("users-data").find({
        "favorites.food": {
            $eq: "pizza"
        }
    }).sort({
        age: 1
    })
    ```

4.  Find all users over 30 whose favorite color is "green". <br />
    &rarr;

    ```
    db.getCollection("users-data").find({
        age: {
            $gt: 30
        },
        "favorites.color": "green"
    })
    ```

5.  Count the number of users whose favorite movie is "The Shawshank Redemption". <br />
    &rarr;

    ```
    db.getCollection("users-data").find({
        "favorites.movie": "The Shawshank Redemption"
    }).count()
    ```

6.  Update the zipcode of the user with the email "johndoe@example.com" to "10002". <br />
    &rarr;

    ```
    db.getCollection("users-data").updateMany(
        { email: "johndoe@example.com" },
        {
            $set: {
                "address.zipcode": "10002"
            }
        }
    )
    ```

7.  Delete the user with the email "alicewilliams@example.com" from the user data. <br />
    &rarr;

    ```
    db.getCollection("users-data").deleteOne({
        email: "alicewilliams@example.com"
    })
    ```

8.  Group users by their favorite movie and retrieve the average age in each movie group. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $group: {
                _id: "$favorites.movie",
                avgAge: {
                    $avg: "$age"
                }
            }
        },
        {
            $project: {
                _id: 0,
                "favorites.movie": "$_id",
                averageAge: {
                    $toInt: "$avgAge"
                }
            }
        }
    ])
    ```

9.  Calculate the average age of users with a favorite "pizza" food. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $group: {
                _id: "$favorites.food",
                avgAge: {
                    $avg: "$age"
                }
            }
        },
        {
            $project: {
                _id: 0,
                "favorites.food": "$_id",
                averageAge: {
                    $toInt: "$avgAge"
                }
            }
        },
        {
            $match: {
                "favorites.food": "pizza"
            }
        }
    ])
    ```

10. Perform a lookup aggregation to retrieve the orders data along with the customer details for each order. <br />
    &rarr;

    ```
    db.getCollection("orders-data").aggregate([
        {
            $lookup: {
                from: "customers-data",
                localField: "customer_id",
                foreignField: "_id",
                as: "customer-details"
                }
        }
    ])
    ```

11. Group users by their favorite color and retrieve the count of users in each color group. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $group: {
                _id: "$favorites.color",
                count: {
                    $count: {}
                }
            }
        },
        {
            $project: {
                _id: 0,
                "favorites.color": "$_id",
                count: 1
            }
        }
    ])
    ```

12. Find the user(s) with the highest age. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $group: {
                _id: null,
                maxAge: {
                    $max: "$age"
                }
            }
        },
        {
            $lookup: {
                from: "users-data",
                let: {
                    maxAge: "$maxAge"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$age", "$$maxAge"]
                            }
                        }
                    }
                ],
                as: "users"
            }
        },
        {
            $unwind: "$users"
        },
        {
            $replaceRoot: { newRoot: "$users" }
        }
    ])
    ```

13. Find the most common favorite food among all users. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $group: {
                _id: "$favorites.food",
                count: {
                    $count: {}
                }
            }
        },
        {
            $group: {
                _id: null,
                max: {
                    $max: "$count"
                },
                favouriteFood: {
                    $push: "$$ROOT"
                }
            }
        },
        {
            $project: {
                _id: 0,
                favouriteFood: {
                    $filter: {
                        input: "$favouriteFood",
                        cond: {
                            $eq: ["$max", "$$this.count"]
                        }
                    }
                }
            }
        },
        {
            $unwind: "$favouriteFood"
        },
        {
            $replaceRoot: { newRoot: "$favouriteFood" }
        },
        {
            $project: {
                _id: 0,
                "favorites.food": "$_id",
                count: 1
            }
        }
    ])
    ```

14. Calculate the total count of friends across all users. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $unwind: "$friends"
        },
        {
            $group: {
                _id: null,
                totalFriends: { $addToSet: "$friends" }
            }
        },
        {
            $project: {
                _id: 0,
                totalFriendsCount: { $size: "$totalFriends" }
            }
        }
    ])
    ```

15. Find the user(s) with the longest name. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $addFields: {
                nameLength: { $strLenCP: "$name" }
            }
        },
        {
            $group: {
                _id: null,
                maxLength: { $max: "$nameLength" },
                users: { $push: "$$ROOT" }
            }
        },
        {
            $project: {
                _id: 0,
                users: {
                    $filter: {
                        input: "$users",
                        cond: { $eq: ["$maxLength", "$$this.nameLength"] }
                    }
                }
            }
        },
        {
            $unwind: "$users"
        },
        {
            $replaceRoot: { newRoot: "$users" }
        },
        {
            $project: {
                nameLength: 0
            }
        }
    ])
    ```

16. Calculate each state's total number of users in the address field. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $group: {
                _id: "$address.state",
                totalUsers: {
                    $count: {}
                }
            }
        },
        {
            $project: {
                _id: 0,
                "address.state": "$_id",
                totalUsers: 1
            }
        }
    ])
    ```

17. Find the user(s) with the highest number of friends. <br />
    &rarr;

    ```
    db.getCollection("users-data").aggregate([
        {
            $addFields: {
                totalFriends: {
                    $size: "$friends"
                }
            }
        },
        {
            $group: {
                _id: null,
                maxFriends: {
                    $max: "$totalFriends"
                },
                users: {
                    $push: "$$ROOT"
                }
            }
        },
        {
            $project: {
                _id: 0,
                users: {
                    $filter: {
                        input: "$users",
                        cond: {
                            $eq: ["$maxFriends", "$$this.totalFriends"]
                        }
                    }
                }
            }
        },
        {
            $unwind: "$users"
        },
        {
            $replaceRoot: { newRoot: "$users" }
        },
        {
            $project: {
                totalFriends: 0
            }
        }
    ])
    ```
