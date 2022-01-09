import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// seed by https://corporatelorem.kovah.de/
const getPosts = () => {
  return [
    {
      title: 'Social Media',
      body: 'Much of the group’s activity was concentrated among several dozen large accounts, including one called @blackstagram_ and another called @american. veterans, both of which had more than 200,000 followers. Many of the group’s accounts targeted specific identity groups, including African-Americans, gun-rights supporters and anti-immigration activists.'
    },
    {
      title: 'Videogames',
      body: 'Rocket League is changing in a big way. Today, developer Psyonix announced that, later this summer, the multiplayer cars-meets-soccer game will be going free-to-play. Additionally, the game will get cross-platform progression, covering elements like cosmetic items, battle pass progression, and competitive rank.'
    },
    {
      title: 'Politics',
      body: 'The scandal has rocked Austria. The vice chancellor, a leader of the far-right Freedom Party, quickly resigned, and new elections have been called for September. But it is also rippling across Europe, only days before the European parliamentary elections, as a reminder that Russia has deep ties to many other populist parties, too. "What’s strange," said Tom Tugendhat, a Conservative Party lawmaker in Britain, "is how many of these nationalist movements seem to be in favor of Russia, not their own country."',
    },
    {
      title: 'Science',
      body: 'The European Space Agency calls the crater a "cold trap," where air moving over the frigid ice is cooled, creating a kind of chilly barrier between the ice within the crater and warmer parts of the atmosphere — even in the summer. This isn’t the first time that Korolev crater has had a moment in the spotlight. NASA snapped it making waves in the Martian clouds in 2003, and in April of this year, one of the first images the ESA’s Trace Gas Orbiter captured was a gorgeous shot of the crater’s rim.'
    }
  ]
}

const seed = async () => {
  const john = await prisma.user.create({
    data: {
      username: 'john',
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u"
    }
  })

  await Promise.all(
    getPosts().map(post => {
      return prisma.post.create({ data: {
        userId: john.id,
        ...post
      }})
    })
  )
}

seed()

