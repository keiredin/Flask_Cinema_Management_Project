var db = new Localbase('DreamCinema');

//#region populateTheMovieDatabase
async function checkDbExistance() {
    var x = await db.collection('movieDb').get().then(movies => {
        return (movies.length)
    });
    
    if (x < 10) {
        //Database doesnot exist or is partial
        //Rebuild the database
        db.collection('movieDb').delete()
        moviesDatabase.forEach(element => {
            db.collection('movieDb').add(
                element
            )
        });

    } else {
        console.log("database exists!")
        //Database exists
    }
}
checkDbExistance();
//#endregion

//#region SignUp
async function SignUpUser(email, password) {
    //1,2,10 are error codes
    try {
        return await db.collection('users').doc({
            email: email
        }).get().then(document => {
            if (document == undefined) {
                db.collection('users').add({
                    email: email,
                    password: password
                });
                return 1;
                //   return "Successfully signedUpUser";
            } else {
                console.log("Duplicate User");
                return 2;
                // return `Email has to be uniqe`;
            }
        })

    } catch (error) {
        alert(error);
        return 10;
        // return `Unknown error occurred${error}`;
    }
}
//#endregion

//#region SignIn
async function SignInUser(email, password) {
    try {
        return await db.collection('users').doc({
            email: email,
            password: password
        }).get().then(document => {
            if (document) {
                //Remove the exsting cookie to secure a seamless login
                eraseLoginCookie();
                //Create a new login cookie
                createLoginCookie(email, 1);
                return 1;
                //   return "Successfully SignedIn";
            } else {
                console.log("Email or password is incorrect");
                return 2;
                // return `Email or password is incorrect`;
            }
        })
    } catch (error) {
        alert(error);
        return 10;
        // return `Unknown error occurred${error}`;
    }
}
//#endregion
//#region AccountManagment
async function ChangePassword(email, oldPsw, newPsw) {
    try {
        return await db.collection('users').doc({
            email: email,
            password: oldPsw
        }).get().then(document => {
            if (document) { //user exists
                db.collection('users').doc({
                    email: email
                }).update({
                    password: newPsw
                }).catch(error => {
                    console.log(`UNKNOWN ERROR OCCOURED ${error}`);
                    return 10;
                });
                alert()
                console.log("CHANGE SUCCESSfUL");
                return 1;
                //return "Password change successful";
            } else {
                console.log(`password mismatch`);
                return 2;
                //Password mismatch
            }
        })
    } catch (error) {

        console.log(`UNKNOWN ERROR OCCOURED ${error}`);
        return 10;
    }
}
async function ChangeEmail(oldEmail, newEmail, phoneNumber, password) {
    try {
        if (oldEmail == null || newEmail == null) {
            return 10;
        }
        //CHANGE PHONE NUMBER ONLY
        if (!newEmail) {
            return await db.collection('users').doc({
                email: oldEmail,
                password: password
            }).update({
                phone: phoneNumber
            }).then((e) => {
                //PHONE NUMBER ONLY CHANGE WAS SUCCESSFUL;
                return 4;
            }).catch(error => {
                //Password Mismatch
                console.log(`UNKNOWN ERROR OCCOURED ${error}`);
                return 2;
            });
        }
        //CHANGE BOTH THE EMAIL AND PHONE NO
        return await DoesUserExist(newEmail).then(answer => {
            if (answer) {
                //A USER ALREADY EXISTS with this email
                return 3;
            } else {
                //Change onlythe phone number
                return db.collection('users').doc({
                    email: oldEmail,
                    password: password
                }).get().then(document => {
                    if (document) { //user exists
                        console.log("USER EXISTS PROCEDING CHANGE");
                        db.collection('users').doc({
                            email: oldEmail
                        }).update({
                            email: newEmail,
                            phone: phoneNumber
                        }).catch(error => {
                            console.log(`UNKNOWN ERROR OCCOURED ${error}`);
                            return 10;
                        });
                        console.log("Email change successufl")
                        return 1;
                        //return "Email change successful";
                    } else {
                        console.log(`password mismatch`);
                        return 2;
                        //Password mismatch
                    }
                });
            }

        })

    } catch (error) {
        console.log(`UNKNOWN ERROR OCCOURED ${error}`);
        return 10;
    }
}

async function ChangeSocials(email, twitter, insta) {
    return db.collection('users').doc({
        email: email
    }).update({
        twitter: twitter,
        instagram: insta
    }).then(
        (e) => {
            console.log("CHANGE SUCCESSfUL");
            return 1;
            //return "Operation successful";
        }
    ).catch(error => {
        console.log(`UNKNOWN ERROR OCCOURED ${error}`);
        return 10;
    });

}
async function Changepreferences(email, newsLetter) {
    return db.collection('users').doc({
        email: email
    }).update({
        newsLetter: newsLetter
    }).then((e) => {
        console.log("CHANGE SUCCESSfUL");
        return 1;
        //return "Operation successful";
    }).catch(error => {
        console.log(`UNKNOWN ERROR OCCOURED ${error}`);
        return 10;
    });

}
async function deleteUser(email, password) {
    return db.collection('users')
        .doc({
            email: email,
            password: password
        })
        .delete()
        .then(response => {
            return 1;
        })
        .catch(error => {
            console.log(`password mismatch`);
            return 2;
            //Password mismatch
        });
    // logOutUser();
}
//Helper function for email change
async function DoesUserExist(email) {
    //1,2,10 are error codes
    try {
        return await db.collection('users').doc({
            email: email
        }).get().then(document => {
            if (document == undefined) {
                return false;
                //User doesnot exist
            } else {
                return true;
                //User does exist
            }
        })

    } catch (error) {
        return true;
    }
}
//return user info without the password
async function getuser(email) {
    try {
        return await db.collection('users').doc({
            email: email
        }).get().then(document => {
            document['password'] = null;
            return document;
        })

    } catch (error) {
        return null;
    }
}
//#endregion 
//#region LoginCookie
function createLoginCookie(email, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = "loggedIn=" + email + expires + "; path=/";
}

function readLoginCookie() {
    var nameEQ = "loggedIn" + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseLoginCookie() {
    createLoginCookie("", -1);
}
//#endregion

//#region Movies Database
var moviesDatabase = [{
        "id": 111,
        "name": "Maleficent",
        "desc": "Maleficent and her goddaughter Aurora begin to question the complex family ties that bind them as they are pulled in different directions by impending nuptials, unexpected allies and dark new forces at play.",
        "postor": "malificent.jpg",
        "background": "wallpaper2you_310693.jpg",
        "trailer": "https://www.youtube.com/embed/n0OFH4xpPr4",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Adventure", "Family", "Fantasy"],
        "idmbRating": "6.6",
        "aired": "HBO",
        "release": "18 October 2019 (USA)",
        "ticket": "Available"
    },
    {
        "id": 112,
        "name": "Aquaman",
        "desc": "Arthur Curry, the human-born heir to the underwater kingdom of Atlantis, goes on a quest to prevent a war between the worlds of ocean and land.",
        "postor": "aqua.jpg",
        "background": "382613.jpg",
        "trailer": "https://www.youtube.com/embed/WDkg3h8PCVU",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Fantasy"],
        "idmbRating": "6.9",
        "aired": "Netflix",
        "release": " 21 December 2018 (USA)",
        "ticket": "Available"
    },
    {
        "id": 113,
        "name": "Ferdinand",
        "desc": "After Ferdinand, a bull with a big heart, is mistaken for a dangerous beast, he is captured and torn from his home. Determined to return to his family, he rallies a misfit team on the ultimate adventure.",
        "postor": "ferdinand.jpg",
        "background": "2011711.jpg",
        "trailer": "https://www.youtube.com/embed/HBXVM7oUPVk",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Comedy", "Adventure", " Animation"],
        "idmbRating": "6.7",
        "aired": "Disney",
        "release": "15 December 2017 (USA)",
        "ticket": "Available"
    },
    {
        "id": 114,
        "name": "12 Years a Slave",
        "desc": "In the antebellum United States, Solomon Northup, a free black man from upstate New York, is abducted and sold into slavery.",
        "postor": "12yr.jpg",
        "background": "2564420.jpg",
        "trailer": "https://www.youtube.com/embed/z02Ie8wKKRg",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Biography", "Drama", "History"],
        "idmbRating": "8.1",
        "aired": "Paramount",
        "release": "8 November 2013 (USA)",
        "ticket": "Not Available"
    },
    {
        "id": 115,
        "name": "Mission Impossible: Ghost Protocol",
        "desc": "The IMF is shut down when it's implicated in the bombing of the Kremlin, causing Ethan Hunt and his new team to go rogue to clear their organization's name.",
        "postor": "MI.jpg",
        "background": "3440775.jpg",
        "trailer": "https://www.youtube.com/embed/EDGYVFZxsXQ",
        "screening": "Mar 5, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Thriller"],
        "idmbRating": "7.4",
        "aired": "HBO",
        "release": "21 December 2011 (USA)",
        "ticket": "Available"
    },
    {
        "id": 116,
        "name": "The Pursuit of Happiness",
        "desc": "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
        "postor": "persuitOf happiness.jpg",
        "background": "2024750.jpg",
        "trailer": "https://www.youtube.com/embed/DMOBlEcRuw8",
        "screening": "Mar 5, 2021 00:00:00",
        "genre": ["Biography", "Drama"],
        "idmbRating": "8.0",
        "aired": "Netflix",
        "release": "15 December 2006 (USA)",
        "ticket": "Available"
    },
    {
        "id": 117,
        "name": "Pirates of The Carribean",
        "desc": "Blacksmith Will Turner teams up with eccentric pirate  Jack Sparrow to save his love, the governor's daughter, from Jack's former pirate allies, who are now undead.",
        "postor": "pocccccccc.jpg",
        "background": "1103973.jpg",
        "trailer": "https://www.youtube.com/embed/Hgeu5rhoxxY",
        "screening": "Mar 5, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Fantasy"],
        "idmbRating": "8.0",
        "aired": "Netflix",
        "release": " 9 July 2003 (USA)",
        "ticket": "Not Available"
    },
    {
        "id": 118,
        "name": "John Wick: Chapter 3",
        "desc": "John Wick is on the run after killing a member of the international assassins' guild, and with a $14 million price tag on his head, he is the target of hit men and women everywhere.",
        "postor": "wick.jpg",
        "background": "1460186.jpg",
        "trailer": "https://www.youtube.com/embed/M7XM597XO94",
        "screening": "Mar 5, 2021 00:00:00",
        "genre": ["Action", "Crime", "Thriller"],
        "idmbRating": "7.4",
        "aired": "Netflix",
        "release": " 17 May 2019 (USA)",
        "ticket": "Not Available"
    },
    {
        "id": 119,
        "name": "Black Panther",
        "desc": "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
        "postor": "bppp.jpg",
        "background": "54056.jpg",
        "trailer": "https://www.youtube.com/embed/xjDjIWPwcPU",
        "screening": "Mar 6, 2021 00:00:00",
        "genre": ["Action", "Adventure", " Sci-Fi"],
        "idmbRating": "7.3",
        "aired": "Marvel",
        "release": "16 February 2018 (USA)",
        "ticket": "Available"
    },
    {
        "id": 120,
        "name": "Avengers: Endgame",
        "desc": "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        "postor": "endgame.jpg",
        "background": "329583.jpg",
        "trailer": "https://www.youtube.com/embed/TcMBFSGVi1c",
        "screening": "Mar 6, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Drama"],
        "idmbRating": "8.4",
        "aired": "Marvel",
        "release": "26 April 2019 (USA)",
        "ticket": "Not Available"
    },
    {
        "id": 121,
        "name": "Game of Thrones",
        "desc": "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
        "postor": "GOT.jpg",
        "background": "25498.jpg",
        "trailer": "https://www.youtube.com/embed/rlR4PJn8b8I",
        "screening": "Mar 6, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Drama"],
        "idmbRating": "9.3",
        "aired": "HBO",
        "release": " TV Series (2011–2019)",
        "ticket": "Available"
    },
    {
        "id": 122,
        "name": "Thor: Ragnarok",
        "desc": "Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the powerful and ruthless villain Hela.",
        "postor": "Thor3.jpg",
        "background": "222191.jpg",
        "trailer": "https://www.youtube.com/embed/ue80QwXMRHg",
        "screening": "Mar 6, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Comedy"],
        "idmbRating": "7.9",
        "aired": "Marvel",
        "release": " 3 November 2017 (USA)",
        "ticket": "Not Available"
    },
    {
        "id": 123,
        "name": "No Time TO Die",
        "desc": "James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.",
        "postor": "NoTimeToDie.jpg",
        "background": "2198206.jpg",
        "trailer": "https://www.youtube.com/embed/vw2FOYjCz38",
        "screening": "Oct 8, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Thriller"],
        "idmbRating": "x.x",
        "aired": "Paramount",
        "release": " 8 October 2021 (USA)",
        "ticket": "Available"
    },
    {
        "id": 124,
        "name": "Fast and Furious 9",
        "desc": "Cypher enlists the help of Jakob, Dom's younger brother to take revenge on Dom and his team.",
        "postor": "fasssstttt.png",
        "background": "2601718.jpg",
        "trailer": "https://www.youtube.com/embed/_qyw6LC5pnE",
        "screening": "May 28, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Crime"],
        "idmbRating": "x.x",
        "aired": "HBO Max",
        "release": " 28 May 2021 (USA)",
        "ticket": "Available"
    },
    {
        "id": 125,
        "name": "Godzilla Vs Kong",
        "desc": "The epic next chapter in the cinematic Monsterverse pits two of the greatest icons in motion picture history against one another - the fearsome Godzilla and the mighty Kong - with humanity caught in the balance.",
        "postor": "godzillaVsKongPs.jpg",
        "background": "godzillaVsKong.jpg",
        "trailer": "https://www.youtube.com/embed/odM92ap8_c0",
        "screening": "Mar 31, 2021 00:00:00",
        "genre": ["Action", "Sci-Fi", "Thriller"],
        "idmbRating": "x.x",
        "aired": "HBO",
        "release": "31 March 2021 (USA)",
        "ticket": "Available"
    },
    {
        "id": 126,
        "name": "Free Guy",
        "desc": "A bank teller discovers that he's actually an NPC inside a brutal, open world video game.",
        "postor": "freeeee.jpg",
        "background": "free-guy-movie-2020-r4.jpg",
        "trailer": "https://www.youtube.com/embed/JORN2hkXLyM",
        "screening": "May 21, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Comedy"],
        "idmbRating": "9.5",
        "aired": "Amazon Prime",
        "release": " 21 May 2021 (USA)",
        "ticket": "Available"
    },
    {
        "id": 127,
        "name": "Mulan",
        "desc": "A young Chinese maiden disguises herself as a male warrior in order to save her father.",
        "postor": "mulan.jpeg",
        "background": "4251936.jpg",
        "trailer": "https://www.youtube.com/embed/KK8FHdFluOQ",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Drama"],
        "idmbRating": "5.6",
        "aired": "Disney +",
        "release": " 4 September 2020 (USA)",
        "ticket": "Available"
    },
    {
        "id": 128,
        "name": "Black Widow",
        "desc": "A film about Natasha Romanoff in her quests between the films Civil War and Infinity War.",
        "postor": "black widow.jpg",
        "background": "430398.jpg",
        "trailer": "https://www.youtube.com/embed/RxAtuMu_ph4",
        "screening": "May 7, 2021 00:00:00",
        "genre": ["Action", "Adventure", "Sci-Fi"],
        "idmbRating": "x.x",
        "aired": "Marvel",
        "release": "7 May 2021 (USA)",
        "ticket": "Available"
    },
    {
        "id": 129,
        "name": "Holidate",
        "desc": "Fed up with being single on holidays, two strangers agree to be each other's platonic plus-ones all year long, only to catch real feelings along the way.",
        "postor": "holidate.jpg",
        "background": "emma_roberts_holidate_2020_4k_hd_movies.jpg",
        "trailer": "https://www.youtube.com/embed/p-_J_YllcP0",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Comedy", "Romance"],
        "idmbRating": "6.1",
        "aired": "HBO",
        "release": " 28 October 2020 (USA)",
        "ticket": "Not Available"
    },
    {
        "id": 130,
        "name": "Joker",
        "desc": "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.",
        "postor": "jocker.jpg",
        "background": "",
        "trailer": "https://www.youtube.com/embed/-_DJEzZk2pc",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Crime", "Drama", "Thriller"],
        "idmbRating": "8.4",
        "aired": "HBO",
        "release": "4 October 2019 (USA)",
        "ticket": "Not Available"
    },
    {
        "id": 131,
        "name": "Croods New Age",
        "desc": "The prehistoric family the Croods are challenged by a rival family the Bettermans, who claim to be better and more evolved.",
        "postor": "croods.jpg",
        "background": "the_croods_a_new_age_4k_hd_movies.jpg",
        "trailer": "https://www.youtube.com/embed/a-o8xbEcuSY",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Animation", "Adventure", "Comedy"],
        "idmbRating": "7.0",
        "aired": "Disney+",
        "release": " 25 November 2020 (USA)",
        "ticket": "Not Available"
    },
    {
        "id": 132,
        "name": "Tom and Jerry",
        "desc": "Adaptation of the classic Hanna-Barbera property, which reveals how Tom and Jerry first meet and form their rivalry.",
        "postor": "tom.jpg",
        "background": "tom_and_jerry_2021_hd_tom_and_jerry.jpg",
        "trailer": "https://www.youtube.com/embed/fgqEyC19538",
        "screening": "Mar 4, 2021 00:00:00",
        "genre": ["Animation", "Adventure", "Comedy"],
        "idmbRating": "5.6",
        "aired": "Disney+",
        "release": " 26 February 2021 (USA)",
        "ticket": "Available"
    },
    {
        "id": 133,
        "name": "Raya and The Last Dragon",
        "desc": "In a realm known as Kumandra, a re-imagined Earth inhabited by an ancient civilization, a warrior named Raya is determined to find the last dragon.",
        "postor": "raya.png",
        "background": "raya_and_the_last_dragon_poster_hd_the_last_dragon.jpg",
        "trailer": "https://www.youtube.com/embed/1VIZ89FEjYI",
        "screening": "Mar 5, 2021 00:00:00",
        "genre": ["Animation", "Action", "Adventure"],
        "idmbRating": "x.x",
        "aired": "Disney",
        "release": "5 March 2021 (USA)",
        "ticket": "Available"
    },
    {
        "id": 134,
        "name": "Minions: Rise of Gru",
        "desc": "The untold story of one twelve-year-old's dream to become the world's greatest supervillain.",
        "postor": "gru.jpg",
        "background": "x1080.jpg",
        "trailer": "https://www.youtube.com/embed/pN1HNkoL2QA",
        "screening": "Jul 2, 2021 00:00:00",
        "genre": ["Comedy", "Adventure"],
        "idmbRating": "x.x",
        "aired": "Disney",
        "release": " 2 July 2021 (USA)",
        "ticket": "Available"
    }
]
//#endregion