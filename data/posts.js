// ── BLOG POST CONTENT ─────────────────────────────────────
// Each key is the URL slug: /blog/<slug>
const posts = {
  'ai-adoption': {
    title: 'Reflection on AI usage',
    date: 'September 2026',
    meta: '',
    tags: [],
    body: `<p>i think generative ai -- to a certain extent -- has completely transformed the human experience. although most of my work has been on the textual modality and it's a bit too early to see the long-term effects of these systems in a meaningfully measurable way, it's not unfair to say that in the majority of the public discourse, the entire Socratic method has more so been turned into a cooperative effort between the human and the machine, instead of an entirely human operation. which is both concerning and exciting.</p>
           <p>contrary to popular belief, i do think there's a benefit to offloading some of the more common-sense operations to artificial intelligence. it's almost like applying a bell curve to the overall population. however, the downside effect is that some of the human experience is mostly learnt through living a particular event, so as the population ages, i'm not quite sure if humans of the future will learn how to apply things effectively, if they co-operate their life-events.</p>
           <p>it's a weird thing to think about. we're drastically lowering the intelligence gap that has existed throughout the entirety of human existence and experience, leading to the downfall and the rising of various cultures and groups. it might also potentially mean that all humans sound the same, given that, as it stands now, as much as we'd like to argue otherwise, ai is still ethnocentric, and monoethnic (mostly). it has biases. it has constructs that are ultimately built on the constructs of what can be hijacked from the public and modern internet.</p>`
  },
  'reflections-on-arts': {
    title: 'Reflections on the Arts',
    date: 'December 2023 -- Edited July 2026',
    meta: 'Arts, Music, Culture, History',
    tags: ['Arts', 'Music', 'Culture', 'History', 'Personal Thoughts'],
    body: `<p><code>I oftentimes think about the arts. I'm not an artist by any means, but that's what makes the arts unique: you need not any education to enjoy it. This puts the arts in a unique place compared to the sciences. As I am writing this, I am listening to 1920s ballroom music. These people are gone, most of their memories and aspirations long with them. Yet one thing remains: the arts. I feel the sway, the feelings they engraved in their music, much like how they are engraved on the vinyl records.</code></p>
           <p>When I wrote those two paragraphs in December of 2023, gpt-4 had just arrived and claude 2 was out. The argument was that what makes something art is that it makes you feel something, and the fact that you feel it at all is what makes you human. It hadn't occurred to me back then that "art is human" is a claim that I'd ever have to defend.</p>
           <p>Though I should admit I have been trying to work out what the arts mean to me for a while, and trying to expand on this idea to a larger scale. At twenty I wanted to begin writing about my perception of my childhood, and how I thought about certain things, because I thought I was too scared to forget about myself. In that piece, I also tried to define art, and I was trying to be very specific about it. "There's no proper scientific definition," I said, but mine was this: "Art is visually or aurally compelling material that depicts creativity and imagination." Science solves problems and answers questions creatively; art uses imagination to make things that are a pleasure to look at, hear, or move to. Nothing else. The humanities sit next door to art but must never be merged with it. Art is art. Even though art is ultimately done for pleasure and depiction, I argued that art also obeys no one. It doesn't follow what society wants, doesn't answer to authority, doesn't respect respectability; suppress it and you only get more of it. A cockroach, I called it, to the people trying to stamp it out. Its only rule is that it has no rules.</p>`
  },
  'social-computing': {
    title: 'Social Computers/Computing',
    date: 'December 2023',
    meta: 'Computing, Technology, Society, HCI',
    tags: ['Computing', 'Technology', 'Society', 'HCI'],
    body: `<p>We humans love to use the word <em>computing</em> a lot. In many introductory courses it is described as the first matter to be disclosed — pretty much defining everything as a computer capable of some form of electronic computation.</p>
           <p>From a social perspective, we deal with computers every day and they become part of our social lives. Socially-aware machines that seamlessly interact with our society are vital for creating communities that can live in technologically advanced spaces.</p>`
  },
  'intellectual-curiosity': {
    title: 'Intellectual Curiosity',
    date: 'December 2023',
    meta: 'Psychology, Mind, Thought Process',
    tags: ['Intellectual Curiosity', 'Psychology', 'Mind', 'Thought Process'],
    body: `<p>I find intellectual curiosity to be a fascinating area of study. The mind serves as both a cage and a blank canvas. Like a garden, it's somewhere you can roam and take in unique scents and characters. Like a cage, it can feel claustrophobic when you're stuck with a problem you can't find the first steps toward solving.</p>
           <p>I find myself there quite a lot. At even times of crisis my mind works more than it should — not always chasing intellectually grand questions, but problems requiring an inquiry of the mind. Almost as if I self-cage myself with a thought, mostly unintentionally, making the actual problem a secondary task.</p>`
  },
  'on-luxury': {
    title: 'On Luxury',
    date: 'March 2026',
    meta: 'Opinion, Consumer Culture, Design',
    tags: ['Opinion', 'Consumer Culture', 'Design', 'Personal Thoughts'],
    body: `<p>I think luxury has a weird connotation. More often than not, people utilize the meaning of luxury to determine the <em>quality</em> of a given product. Nowadays, I see many people engage in the activity of trying to obtain luxury products with their first checks — trying to get as many designer brands to wear as possible and just engaging in a consumerist mindset while they don't even have the money to live a life of prosperity.</p>
           <p>Now, I'm not going to pretend like I'm better than any of these people in the slightest, given I'm basically in a similar situation in the technology space. However, I wanted to write an opinion piece about the world of luxury, as it is not an area I'm completely aware of — so this will allow me to get some clarity.</p>
           <p>I think the true meaning of luxury doesn't come from the brand name, but rather from how much the brand trusts itself in its products. A product can be expensive, sure, but that shouldn't matter as long as the brand stands behind what they're making. A company like Arc'teryx or North Face has much more in value than a company like Rolex in terms of the product they're making, because they offer lifetime warranties. Yes, if people can afford to pay $3k for a bag from YSL they can probably afford another one — and they get two years of warranty. They'd get none if they bought it from LV. In that context, I'd trust YSL's products a lot more.</p>
           <p>It's not that people who shop from luxury fashion houses would ever need to use such warranties to begin with, since they mainly buy for the brand. However, it does signal to me that the brand uses quality materials they can be trusted on — and that they're not just leveraging their namesake like Supreme does to get people to buy bricks.</p>`
  },
  'math-and-life': {
    title: 'Math & Life',
    date: 'March 2026',
    meta: 'Mathematics, Philosophy, Probability, Life',
    tags: ['Mathematics', 'Philosophy', 'Probability', 'Personal Thoughts'],
    body: `<p><em>this was a conversation i've had after being half in off a scotch at a friend's party</em></p>
           <p>I think that our perception of life, and everything we do in this world are based on maths. While borderline an unbaked, half cracked, and deranged concept, I believe that everything we do is somewhat calculable (or have been calculated — if you want to take it that far), and that a great creator is just an amazing entity that does mathematics in a dimension we do not understand.</p>
           <p>Math is the closest thing we have to the language of the universe, and the afterlife. We're playing a game of probabilistic events, sometimes chained up and quite dependent in nature, and non-chained up and quite independent in nature.</p>
           <p>By no means am I a mathematician, nor have I ever claimed to be. I am not a philosopher either. I'd like to think that I have an average understanding of mathematics, having taken undergraduate level calculus, linear algebra and the like. Looking at mathematics in an esoteric way isn't a new idea per se, but it is somewhat an interesting window to see life from.</p>
           <p>I have tried more and more to think of life this way, and I must say it makes me sleep better at night. It somewhat sounds rather counterintuitive to believe that thinking that <em>nothing</em> is deterministic is a better way to look at life — that postulating no reaction or action taken is determinant of the outcome is quite the naïveté of a 5-year-old. But that is the sole fact that makes things <em>changing</em>. Nothing is more natural than change. Rather than believing that things and people are like the soil we live in — that there is change around things that do not change — we should instead measure life as constant change, like the weather.</p>
           <p>This unfortunately creates an interesting enigma of truth. There's no universal truth. There is only contextual truth, or truth that we choose to identify as truth within our society or social structure that we find applicable. We cannot take "goodness" as a part of the universal experience. Given the axiom we declare — that mathematics can explain everything — this would imply that there is <em>no inherent nature of what makes things good or bad.</em></p>
           <p>Accepting a probabilistic (or spectral world model, if you'd rather extrapolate this idea further) could inherently give you the freedom to freely explore your own destiny. Or it could mean that you have to constantly think about the observations that change without your set of events. Funnily enough, more than likely, you will be going back and forth between this continuum your entire life. Ergo, it is more a case of active partaking in manifestation — or playing with the bias and weights of your assumed functions, if you want to think of it from an algebraic perspective — than it is deliberate control of the outcome of events.</p>`
  },
  'helloworld': {
    title: 'Hello World!',
    date: 'April 2022',
    meta: 'Blogging, Personal',
    tags: ['Blogging', 'Personal', 'Research', 'Ideas'],
    body: `<p>Welcome to my blog! Here I'm hoping to share my takes on things happening in the world, research papers I've been involved with, and my experience as a Yellowjacket!</p>
           <p>I'll also write about some of my ideas — brilliant and shady alike.</p>
           <p>If you get to see this page, let me know what you'd like to see here. I'd be more than happy to write about it!</p>
           <p>Talk to y'all soon. I mean, not <em>talk talk</em> — but talk!</p>`
  },
};
