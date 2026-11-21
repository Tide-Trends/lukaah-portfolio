/* Would You Rather */
(() => {
"use strict";
// [category, option A, option B, twist if you picked A, twist if you picked B]
// Each twist is aimed at the option you picked, to make keeping it harder.
const Q = [
  // ---------- OUT OF POCKET ----------
  ["pocket","Have every text you've ever sent printed and mailed to your boss","Have every thought you have for 24 hours read aloud to your family",
    "The printout is also taped up in the break room. HR reads it before your boss does.",
    "The 24 hours land on a family funeral, and everyone is in the same room as you."],
  ["pocket","Have your camera roll projected at your own funeral","Have your search history engraved on your tombstone",
    "It's on shuffle, hidden and deleted folders included, and your grandparents are in the front row.",
    "It's your search history from age 13 to 19, and the cemetery gives walking tours."],
  ["pocket","Have your parents host a podcast about your dating life with 2 million listeners","Have your most recent ex get a weekly newspaper column about you",
    "Your parents bring each of your exes on as a guest. Season 1 is already recorded.",
    "Your current (or next) partner is the column's editor and approves every word."],
  ["pocket","Accidentally like your ex's photo from 2014 every single morning","Accidentally text \"love you\" to your boss once a week",
    "Your ex's new partner screenshots every like and posts a running tally.",
    "Your boss starts replying \"love you too.\" Last week it went to the whole company."],
  ["pocket","Have a laugh track play after everything you say","Have sad violin music play, audible to everyone, whenever you're upset",
    "It also plays when you deliver bad news. Breakups. Condolences. Layoffs.",
    "It kicks in when you're slightly annoyed too. Slow walkers. Self-checkout. This line."],
  ["pocket","Make your full browser history public with your name on it","Make your full bank statements public with your name on it",
    "Incognito included, sorted by time of day.",
    "Every Venmo note. Every 2 a.m. food order. Every subscription you forgot about."],
  ["pocket","Have your mom as your only follower, commenting on everything","Have your entire high school class see every post you make, forever",
    "She also reads every comment thread aloud at her book club.",
    "Your high school bully gets to pin one comment on every post."],
  ["pocket","Have your sleep-talking livestreamed nightly","Have your dreams uploaded to YouTube every morning",
    "Your partner (or future partner) is the top commenter.",
    "The algorithm pushes them to everyone you went to high school with."],
  ["pocket","Be stuck in an elevator for 3 hours with your ex and their new partner","Be stuck in an elevator for 3 hours with your boss while you have food poisoning",
    "They spend the whole 3 hours arguing about you.",
    "It's your first day, and your boss is the CEO."],
  ["pocket","Have your friends publicly rank all your exes","Have all your exes publicly rank you",
    "Your current partner is on the list, and they come in last.",
    "They compare notes in a group chat first, and you're in it."],
  ["pocket","Wear your exact 7th grade outfit to your next job interview","Have your 7th grade self conduct your next job interview",
    "It's your dream job, and they record every interview.",
    "Your 7th grade self also decides whether you keep your current job."],
  ["pocket","Lick the escalator handrail at the mall","Drink one full glass of water from a public pool in August",
    "It's an airport escalator in flu season, and you lick the whole way down.",
    "It comes from the kiddie pool at a water park on the 4th of July."],
  ["pocket","Have your entire group chat history read out at your wedding","Have your best friend give your wedding speech after 9 drinks with no notes",
    "Your new in-laws read it aloud, and that includes the thread about them.",
    "They also keep the microphone for the whole reception."],
  ["pocket","Have your phone randomly call your crush once a day for 10 seconds","Have your phone randomly post your last photo to your story once a week",
    "Sometimes the call goes out at 3 a.m., and they hear whatever you're doing.",
    "Screenshots count as photos."],
  ["pocket","Every time you lie, you sneeze loudly","Every time someone compliments you, you burp",
    "Polite lies count. \"I love it.\" \"I'm fine.\" \"Happy for you.\"",
    "That includes compliments on first dates, in job interviews, and in your wedding vows."],
  ["pocket","Be caught singing alone in your car by your crush every week","Have your crush hear you talking to yourself, once, at your worst",
    "They film it every time, and it's turning into a series.",
    "You were talking about them, by name, for a long time."],
  ["pocket","Have your therapist's notes about you leak to your friends","Have your friends' honest notes about you leak to your therapist",
    "The notes include everything you've said about those exact friends.",
    "Your therapist reads them, then quietly agrees in every session."],
  ["pocket","Find out exactly what your partner's ex says about you","Find out exactly what your own ex says about you",
    "Your partner agrees with about half of it.",
    "It's the exact version they told everyone you both know."],
  ["pocket","Have everyone see your screen time report, broken down by app","Have everyone see your Spotify listening history from your worst breakup",
    "It shows how many hours you spent on one specific person's profile.",
    "Timestamps included, like the song you played 47 times between 2 and 4 a.m."],
  ["pocket","Show up to a funeral dressed for a costume party","Show up to a costume party dressed for a funeral and stay in character all night",
    "You're dressed as a clown, and you're giving the eulogy.",
    "Your character is the grieving widow, and the host doesn't know it's a bit."],
  ["pocket","Have your future kid read every message you sent at 16","Have your 16-year-old self read every message you send today",
    "They read them at 16 and quote them back at you during every fight.",
    "Your 16-year-old self also gets to text your current boss once."],
  ["pocket","Smell your own breath, constantly, forever","Smell everyone else's breath, constantly, forever",
    "Everyone around you smells it at the same strength you do.",
    "That includes every date, every kiss, and every dentist."],
  ["pocket","Get roasted on stage by a pro comedian who knows all your secrets","Roast your own family on stage while they sit in the front row",
    "It's televised, and your family and your boss are in the audience.",
    "Afterward your family roasts you back, with a professional writer."],
  ["pocket","Have your current location shared live with every ex","Have every ex's current location shared live with you, forever",
    "Your current partner gets a ping every time an ex checks it.",
    "One night, one of them is parked outside your place."],
  ["pocket","Say yes to the next 10 things anyone asks you","Say no to the next 10 things the people you love ask you",
    "The first ask is from the stranger reading this over your shoulder.",
    "One of the 10 is your best friend asking you to be in their wedding."],
  ["pocket","Have a stranger read your journal out loud on a train","Have your dad read your journal silently, and never mention it",
    "It's your daily commute, and the stranger rides it every day.",
    "You catch him re-reading one page, and it's the worst one."],

  // ---------- BIG BRAIN ----------
  ["brain","Use a teleporter that destroys you and builds a perfect copy at your destination, every day","Have a 2-hour commute each way, forever",
    "Sometimes it glitches and doesn't destroy the original. Now there are two of you, and one has to go.",
    "It's a packed bus with no signal. That's 1,000 hours a year, every year."],
  ["brain","Take only the mystery box (a perfect predictor put $1M in it only if it predicted you'd take it alone)","Take both boxes: the mystery box plus a guaranteed $1,000",
    "The predictor decided yesterday, and nothing you do now changes what's in the box. You're leaving $1,000 on the table.",
    "Everyone who's taken both boxes so far, all 1,000 of them, walked away with exactly $1,000."],
  ["brain","Know for certain we're in a simulation","Never know, but probably not in one",
    "You also find out it's someone's school project, and it's due Friday.",
    "Everyone else gets told for sure. You're the only one who doesn't know."],
  ["brain","Be the smartest person in a mediocre world","Be the least smart person in a world of geniuses",
    "Nobody can follow what you say, including the people you love.",
    "They're kind about it, which is worse. They slow down when they talk to you."],
  ["brain","Have perfect memory of everything you've ever experienced","Be able to permanently forget anything you choose",
    "That's every argument word for word, and every face someone made when you let them down.",
    "You don't remember what you erased or why. You might have done it already."],
  ["brain","Go back to 1500 with a modern phone (offline, solar charger)","Go forward to 2500 with nothing but the clothes you're wearing",
    "You land in Europe during a plague, speaking modern English. A glowing rectangle looks a lot like witchcraft.",
    "In 2500, people from the past get kept in a museum, a nice one, for life."],
  ["brain","Upload your mind to a computer right before you die","Die naturally, and that's that",
    "The company that owns the servers was just bought by an ad company.",
    "Your whole family uploads. You're the only one who doesn't."],
  ["brain","Know the answer to any question, but never know how you know","Learn anything perfectly, but only one subject per year",
    "You can never show your work, so no one ever believes you, even when it matters.",
    "That's maybe 50 subjects in a lifetime, and you have to pick the first one before the line moves."],
  ["brain","Prove irrefutably that God exists, but never be able to share the proof","Prove irrefutably that God doesn't exist, but never be able to share the proof",
    "You also learn that God is disappointed in you specifically.",
    "Everyone you love still believes. You sit through every prayer knowing."],
  ["brain","Have a pause button for the world","Have a rewind button that goes back exactly 10 seconds",
    "You keep aging while it's paused. Nobody else does.",
    "You're the only one who remembers the rewound version, every time."],
  ["brain","Know the exact number of people who secretly dislike you","Know exactly who they are, but not how many there are total",
    "It's 41, and you'll guess at it for the rest of your life.",
    "The first name is your best friend. The second is one of your parents."],
  ["brain","Change one moment in history","Learn the complete truth about every moment in history, but change nothing",
    "You can't predict the ripple. There's a 1 in 3 chance you erase someone you love.",
    "The truth includes what really happened to someone you lost, and it wasn't an accident."],
  ["brain","Live 1,000 years as yourself","Experience every human's life, all at once, for one second",
    "Everyone you love dies on a normal schedule, and you go through that about 15 times.",
    "That second includes every war, every famine, and every worst last moment ever lived."],
  ["brain","Be a genius artist who's only recognized after you die","Be a mediocre artist who's famous right now",
    "You die poor at 41, with a basement full of work nobody has seen.",
    "Everyone keeps calling the dead artist the real genius, and you know they're right."],
  ["brain","Live in a world where everyone's salary is public","Live in a world where everyone's medical history is public",
    "On day one you learn the coworker who does half your work makes 40% more.",
    "That includes mental health records, and employers check them before they hire."],
  ["brain","Understand why there's something rather than nothing, but lose the ability to feel wonder","Never know, and keep wondering forever",
    "The answer is boring. It fits in one sentence.",
    "Everyone else finds out the day after you die."],
  ["brain","See 10 seconds into the future","Remember the last 10 years with perfect detail",
    "You see every accident 10 seconds ahead, and you can stop almost none of them.",
    "That's every breakup, every funeral, and every humiliation, in 4K."],
  ["brain","Have every decision you make be mathematically optimal, but never feel like it was yours","Make your own messy decisions and own the consequences",
    "It picks who you marry, and it isn't who you would have picked.",
    "Within 5 years, one of your messy choices wrecks something big."],
  ["brain","Be the only person on Earth who can't lie","Be the only person on Earth who can lie",
    "Everyone knows you can't lie. Your boss, your mom, and your partner start asking you everything.",
    "Everyone believes you, every time, and you can feel it changing who you are."],
  ["brain","Know your exact date of death","Know exactly how you'll die, but not when",
    "It's 9 years from today.",
    "It's drowning, and you live near the ocean."],
  ["brain","Have your personality become the literal average of the 5 people you spend the most time with","Have your personality frozen exactly as it is today, forever",
    "It's averaged from the 5 people you spend the most time with right now.",
    "Frozen as you are right now, in this line, in this mood."],
  ["brain","Solve one major unsolved problem in science, but nobody believes it was you","Get full credit for a discovery you didn't make, and know it forever",
    "The person who gets the credit is someone you can't stand, and they give TED talks about it.",
    "The real discoverer is broke, and they email you once a year."],
  ["brain","Live forever, healthy at 30, knowing you'll eventually outlive the Sun","Live a normal 85 years",
    "You can never opt out, not even after Earth is gone.",
    "Everyone else you know takes the forever option."],
  ["brain","Speak every human language fluently","Understand every animal, but they're mostly complaining",
    "You also understand every insult muttered about you, in any language, anywhere.",
    "Your pets mostly complain about you."],
  ["brain","Forget every book you read the moment you finish it","Remember every bad movie you've ever seen in full, scene-by-scene detail",
    "Starting today, that includes textbooks, manuals, and contracts.",
    "They play in your head whenever it's quiet."],
  ["brain","Be the first person to meet alien life, and they're hostile","Be the last generation to never know if aliens exist",
    "They judge all of Earth on how that first meeting goes, and that meeting is you.",
    "Your kids find out the year after you die."],
  ["brain","Have time move 2x faster when you're happy","Have time move 2x slower when you're bored",
    "Your best days feel like 20 minutes, and your wedding feels like a lunch break.",
    "This line just got twice as long."],
  ["brain","Instantly master any skill by watching it once, but forget it after a week","Master one skill completely, slowly, over 10 years, and keep it forever",
    "You'll never know anything long enough to be anyone's go-to person.",
    "You have to name the skill right now, before the line moves."],
  ["brain","Have a clone of you that does your job while you do whatever you want (it gets the credit)","Do everything yourself and get credit for all of it",
    "The clone gets promoted, and your partner starts preferring to talk to it.",
    "No days off for the next 5 years."],

  // ---------- MORAL DAMAGE ----------
  ["moral","Pull the lever: 1 stranger dies, 5 strangers live","Do nothing: 5 strangers die, 1 lives, and you never touched it",
    "The one person is a kid, and they're looking right at you.",
    "The five can see you standing at the lever, and they're begging."],
  ["moral","Live in a perfect city whose happiness depends on one child suffering in secret","Leave forever and walk into the unknown",
    "Everyone has to visit the child once a year, you included.",
    "Everyone you love stays in the city. None of them come with you."],
  ["moral","Plug into a machine that gives you a perfect simulated life you'll believe is real","Stay in your real, flawed life",
    "The people you love in real life watch your body lie there for 50 years.",
    "Your real life has one major loss coming in the next year, guaranteed."],
  ["moral","Save your own dog from drowning","Save a stranger you've never met from drowning",
    "The stranger is a kid, and their parent watches you swim to the dog.",
    "Your dog watches you swim past."],
  ["moral","Tell your best friend their partner is cheating, and blow up the friend group","Stay quiet forever and watch them get married",
    "Your best friend doesn't believe you and picks the partner.",
    "They ask you to give the toast."],
  ["moral","Get $10M, but one random stranger somewhere loses their life savings","Get nothing, and nobody loses anything",
    "It's a retired teacher in your city, and you'll see the local news story.",
    "$10M would clear your parents' debt and cover your own medical bills, forever."],
  ["moral","Turn in your sibling for a serious crime","Lie under oath to protect them",
    "Your parents never speak to you again.",
    "The victim's family is in the courtroom, watching you while you lie."],
  ["moral","Find out your partner cheated once, 5 years ago, and never again","Never find out",
    "You find out at your 10th anniversary dinner, from their best friend.",
    "Everyone else in your life already knows."],
  ["moral","Let 10 guilty people go free","Send 1 innocent person to prison",
    "One of the 10 hurt someone you love.",
    "The innocent person is your age, and they get 20 years."],
  ["moral","Save one child in front of you today","Anonymously donate enough to save 10 children you'll never meet",
    "The 10 are just as real, and you can look up their names afterward.",
    "The child in front of you is screaming, and you have to walk away from them to make the donation."],
  ["moral","Report a coworker who's stealing to feed their kids","Stay quiet and risk losing your own job if it comes out",
    "They get fired and charged. Their kids are 4 and 7.",
    "It comes out, and you're named as the person who knew."],
  ["moral","Have everyone you love forget you exist","Forget everyone you love",
    "You still remember all of them. They look right through you.",
    "They all remember you, and they keep trying to remind you who they are."],
  ["moral","Secretly take credit for a friend's idea that makes you millions (they never find out)","Give them the idea back and stay broke",
    "They stay broke, and they toast to your success at every dinner.",
    "They're bad at business and run it into the ground in a year anyway."],
  ["moral","Have a long life without ever being in love","Have a short life with one great love",
    "You'll be happy, with friends, family, and work, and you'll always wonder.",
    "Short means 34, and you meet them at 30."],
  ["moral","Bring back someone you've lost, for one more day","Never have met them, and never feel the loss",
    "They don't know it's only one day, and you have to decide whether to tell them.",
    "Every lesson and laugh with them goes too, along with the part of you they shaped."],
  ["moral","Erase your worst memory, plus everything you learned from it","Keep it, and everything it taught you",
    "You'll probably make the same mistake again.",
    "It replays in full on the anniversary every year."],
  ["moral","Have a guaranteed happy but completely ordinary kid","Have an extraordinary kid who struggles their whole life",
    "Happy, and they never do one thing that makes you proud in a way you can explain.",
    "They change the world, and they blame you for every bit of the struggle."],
  ["moral","Keep a lost wallet with $2,000 cash belonging to a billionaire","Return it, knowing they won't even notice",
    "It isn't the billionaire's. It belongs to a server who just finished a double shift.",
    "You're $800 short on rent, and it's due Friday."],
  ["moral","Know when every person you meet will die","Know how every person you meet truly feels about you",
    "Your partner's date is in 3 years, and you can't tell them.",
    "Your mom feels about you the way she did when you were 15."],
  ["moral","Serve 2 years in prison for something you didn't do","Let your memories be fully searched by a court to prove your innocence",
    "You miss your best friend's wedding and the birth of your first niece or nephew.",
    "Everything they find goes into the public court record."],
  ["moral","Give up 10 years of your life to add 10 years to a stranger's","Keep your years, and know you could've done it",
    "They come off the end of your life, and those were the years with grandkids.",
    "You meet the stranger a week later. They're 19, and they're in hospice."],
  ["moral","Be paid $1M to never speak to your best friend again","Turn it down, then lose them anyway to a falling-out a year later (you don't know which)",
    "They're never told why. They think you just stopped caring.",
    "The falling-out is your fault, and you know it the whole time."],
  ["moral","Have the world know every good thing you've done","Have the world know every bad thing you've done, and be forgiven for it",
    "They also learn the selfish reason behind each one.",
    "You're forgiven, but no one forgets, and it comes up every holiday."],
  ["moral","Live with someone else's guilty secret, and never be able to tell","Have your own worst secret quietly known by one person who'll never mention it",
    "The secret is about your partner.",
    "The one person is your boss."],
  ["moral","Be a hero no one remembers","Be remembered forever as a villain for something you didn't do",
    "Someone else takes the credit and builds their whole life on it.",
    "Your own family believes it too."],

  // ---------- LIFE PATH ----------
  ["life","Do your dream job for $40k a year","Do a job you hate for $400k a year",
    "You live where rent is $2,400 a month.",
    "You're locked in for 15 years, with no quitting."],
  ["life","Restart your life at 10 years old with everything you know now","Get $5M right now and keep your current age",
    "You have to do middle school again with an adult brain, and nobody listens to a 10-year-old.",
    "Everyone in your life finds out, and every one of them asks for some."],
  ["life","Live in the same town as everyone you love, forever","Live anywhere in the world, but alone",
    "It's the town you grew up in, and you never get a vacation.",
    "Alone means no new friends and no visits from home."],
  ["life","Have one true best friend","Have 50 good friends and no best friend",
    "They move across the world next year.",
    "When you end up in the hospital, nobody is your first call."],
  ["life","Love your job but hate everyone you work with","Hate your job but love everyone you work with",
    "Every one of them gets promoted above you.",
    "They're all quitting next month."],
  ["life","Peak in your 20s","Peak in your 60s",
    "For the next 50 years, you get introduced as who you used to be.",
    "By the time you get there, everyone who doubted you is gone."],
  ["life","Never travel more than 100 miles from home","Never be allowed to go back home",
    "Your best friend moves 200 miles away, and your sibling's wedding is overseas.",
    "One of your parents gets sick back home."],
  ["life","Perfect health until exactly 70, then die in your sleep","Average health until 95",
    "Your first grandkid is born the year you turn 70.",
    "Average means the last 15 years are back pain, pills, and forgetting names."],
  ["life","Win an Olympic gold medal","Win a Nobel Prize",
    "You peak at 23, and nobody ever asks what you did next.",
    "Your discovery gets turned into a weapon."],
  ["life","Work 4 days a week for 70% of your pay","Work 6 days a week for 150% of your pay",
    "Prices go up 20% next year, and you're already at the edge.",
    "Your kid, or future kid, gets one full day a week with you."],
  ["life","Never feel physical pain again","Never feel embarrassment again",
    "You don't notice a burn, a broken bone, or a heart attack until someone else points it out.",
    "Embarrassment is what stops you from saying the worst thing at the worst moment. That's gone too."],
  ["life","Be extremely good-looking but boring","Be plain-looking but magnetic",
    "People stop listening to you after 10 minutes, and eventually that includes your partner.",
    "No one notices you walk in. You start every room from zero."],
  ["life","Know everything that will happen in your life","Never be able to plan anything more than one day ahead",
    "That includes every loss, with its date.",
    "No planned weddings, no trips, and no planned kids. Only today."],
  ["life","Be 10 minutes late to everything","Be 45 minutes early to everything",
    "That includes your own wedding and every flight.",
    "That includes every first date. You're always the one waiting, and they always notice."],
  ["life","Give up music for life","Give up every show and movie for life",
    "No music at your wedding, at funerals, or in the car. Ever.",
    "That includes the show you're halfway through and every one your friends talk about."],
  ["life","Be famous, but never trust anyone's intentions again","Be anonymous, and fully trust the 5 people who know you",
    "Your own family starts selling stories about you.",
    "One of the 5 dies within 10 years."],
  ["life","Text your 15-year-old self one sentence","Get one sentence from your 60-year-old self",
    "Your 15-year-old self ignores it, which is exactly what you would have done.",
    "The sentence is just \"Don't.\" No context."],
  ["life","Live in a mansion in a city you hate","Live in a studio apartment in your favorite city",
    "You can never leave it, not even on vacation.",
    "The studio is 280 square feet, and you're still in it at 45."],
  ["life","Retire at 35 with enough to get by","Retire at 65 rich",
    "Getting by means one bad emergency wipes you out.",
    "There's a 1 in 3 chance your health goes before 65."],
  ["life","Be truly great at one thing","Be pretty good at everything",
    "Nobody pays for that one thing.",
    "You're never the best at anything, and never the person anyone calls first."],
  ["life","Know your soulmate's name but not when you'll meet","Meet them for sure, but not know it's them until 10 years in",
    "It's a really common name, and you meet hundreds of them.",
    "You almost break up 3 times in those 10 years."],
  ["life","Live a life where everything goes right but nothing surprises you","Live a life full of surprises, half of them bad",
    "You'll know every gift, every proposal, and every punchline in advance, forever.",
    "One of the bad surprises is big, and it arrives within a year."],

  // ---------- SOCIAL RISK ----------
  ["social","Hear everything your friends say about you behind your back","Have your friends hear everything you say about them behind theirs",
    "It starts with what they said last night.",
    "That includes the group chat they aren't in."],
  ["social","Make your group chat public","Make your private DMs public",
    "Every name stays on, including the person you were roasting.",
    "Deleted messages included."],
  ["social","Be the funniest person in every room","Be the smartest person in every room",
    "Nobody takes you seriously, even when you're scared.",
    "Nobody invites you to anything casual again."],
  ["social","Be unable to leave any party until you're the last guest","Have to leave every party after exactly 20 minutes",
    "That includes parties at your ex's place.",
    "That includes your own wedding reception."],
  ["social","Be honest with everyone, about everything, for a full week","Have to lie to everyone, about everything, for a full week",
    "That week includes your mom's birthday and your performance review.",
    "That includes your doctor, and your partner asking if you love them."],
  ["social","Be loved by everyone but truly understood by no one","Be fully understood by one person and ignored by everyone else",
    "Your partner never knows the real you either.",
    "That one person moves on in 10 years."],
  ["social","Have your crush find out you like them via a highway billboard","Have them never find out",
    "It's on their commute for a month, with your face on it.",
    "They liked you too, and you hear about it 10 years later."],
  ["social","Have everyone you've ever met get a notification when you think about them","Get a notification every time someone thinks about you",
    "Exes included, especially at 2 a.m.",
    "Each notification comes with a one-line preview of the thought."],
  ["social","Only be able to communicate through voice memos","Have every text you send read aloud by a robot voice to everyone near the recipient",
    "One take each. No re-recording.",
    "The robot reads them in your mom's voice."],
  ["social","Be best friends with your boss","Be bosses with your best friend",
    "They have to fire you next year.",
    "You have to fire them next year."],
  ["social","Always say exactly what you're thinking when someone asks \"what's on your mind?\"","Never be able to ask anyone a question again",
    "Your partner asks it every night before bed.",
    "That includes \"Are you okay?\" and \"Will you marry me?\""],
  ["social","Have every first date go perfectly, but never get a second one","Have every first date be a disaster, but the person always wants a second",
    "One of them was your soulmate.",
    "They also tell all their friends about the disaster."],
  ["social","Be the person everyone calls in a crisis","Be the person everyone invites to a party",
    "Nobody calls you when things are good.",
    "When your own crisis hits, nobody's number comes to mind."],
  ["social","Hear the honest opinion of everyone at your funeral","Have everyone at your funeral hear your honest opinion of them",
    "Your parents speak first.",
    "Your kids are in the front row, and they're on the list."],
  ["social","Have a reputation for being kind but forgettable","Have a reputation for being difficult but unforgettable",
    "Your own family forgets your birthday sometimes.",
    "Your kids call you \"a lot\" in your eulogy."],
  ["social","Only be able to talk about yourself","Never be able to talk about yourself",
    "Even on first dates, and even at someone else's funeral.",
    "Even at the doctor and in job interviews."],
  ["social","Be the only one at the table who didn't get the joke, every time","Be the only one who laughed, every time",
    "The joke is always about you.",
    "The joke is always at someone's expense, and they're sitting at the table."],
  ["social","Have your partner be best friends with your ex","Have your best friend start dating your ex",
    "They text each other more than you and your partner do.",
    "They get married, and you're in the wedding party."],

  // ---------- UNHINGED ----------
  ["chaos","Swap lives with the person directly in front of you in this line","Swap lives with the person directly behind you",
    "Their bank balance, their search history, and their next 6 months come with it.",
    "Their family, their debt, and their group chats come with it."],
  ["chaos","Stand in this exact line forever, but it's in your favorite place on Earth","Skip to the front of every line, but every line is at the DMV",
    "You can never sit down.",
    "Every line counts: coffee, groceries, bathrooms, roller coasters."],
  ["chaos","Have a narrator describe everything you do, audible to everyone","Have a personal theme song play whenever you walk into a room",
    "The narrator also says what you're thinking.",
    "Your most annoying ex picks the song."],
  ["chaos","Sweat maple syrup","Cry hot sauce",
    "Every summer, bees follow you.",
    "It's ghost-pepper hot, and you cry at movies."],
  ["chaos","Be followed everywhere by a mariachi band","Be followed everywhere by one pigeon that silently judges you",
    "They play at funerals, in therapy, and during every first kiss.",
    "The pigeon carries a little notebook and writes things down."],
  ["chaos","Only speak in rhymes","Only speak in questions",
    "That includes breakups and delivering bad news.",
    "That includes your wedding vows and your 911 calls."],
  ["chaos","Have every door you open lead to a random door somewhere on Earth","Have every staircase you take go the opposite direction",
    "Bathroom doors included.",
    "Fire escapes included."],
  ["chaos","Have fingers as long as your legs","Have legs as long as your fingers",
    "You can't hold a phone, and you can't hold hands.",
    "You live on the 4th floor, with no elevator."],
  ["chaos","Teleport 3 feet to the left every time you blink","Lose 3 seconds of time every time you blink",
    "That includes while you're driving.",
    "You blink about 15,000 times a day. That's about 12 hours a day gone."],
  ["chaos","Have a cat the size of a horse","Have a horse the size of a cat",
    "It still knocks things off tables, and now those things are cars.",
    "It needs full horse care and lives 30 years."],
  ["chaos","Only be able to walk backwards","Only be able to walk sideways, like a crab",
    "That includes escalators, stairs, and your walk down the aisle.",
    "Every narrow hallway, airplane aisle, and crowded bar."],
  ["chaos","Have your hair grow one foot every day","Be completely bald, eyebrows included",
    "It grows overnight, and you wake up wrapped in it.",
    "Eyelashes too. Every speck of dust goes straight into your eyes."],
  ["chaos","Have to fight one kangaroo every year, on your birthday","Have one goose follow and attack you once a week at a random time",
    "The kangaroo remembers last year and has been training.",
    "One week it lands in the middle of your wedding vows."],
  ["chaos","Have your voice permanently sound like you just inhaled helium","Have your laugh permanently sound like a dial-up modem",
    "That includes funerals, court, and every breakup.",
    "That includes every nervous laugh in a serious meeting."],
  ["chaos","Fight 20 kids under 5 (they're all organized)","Fight one grandpa who knows martial arts",
    "Their parents are filming.",
    "He's undefeated, and he has nothing left to lose."],
  ["chaos","Eat every meal for the rest of your life with chopsticks","Eat every meal for the rest of your life with your hands",
    "Soup. Cereal. Ice cream. Forever.",
    "Spaghetti, first dates, and fancy restaurants included."],
  ["chaos","Have your shoes squeak with every step, forever","Have one sock always slightly wet, forever",
    "Funerals, libraries, and sneaking in at 2 a.m. included.",
    "You never know which foot until you step down."],
  ["chaos","Have a third arm that does whatever it wants","Have a third eye that sees only the past",
    "It's left-handed, and it doesn't like your boss.",
    "It shows you whatever happened at this exact spot, including in hospitals."],
  ["chaos","Be chased by one T. rex, once","Be chased by 1,000 squirrels, every Thursday",
    "No head start. It's already running.",
    "The squirrels learn and get a little better every week."],
];


const CATS = {
  pocket: { name: "Out of Pocket", color: "#ff3d6e" },
  brain:  { name: "Big Brain",     color: "#7c5cff" },
  moral:  { name: "Moral Damage",  color: "#f59e0b" },
  life:   { name: "Life Path",     color: "#10b981" },
  social: { name: "Social Risk",   color: "#06b6d4" },
  chaos:  { name: "Unhinged",      color: "#84cc16" },
};
const GROUP_LINES = {
  unanimous: ["Unanimous. You're all the same kind of weird.", "Total agreement. Suspicious.", "Nobody broke ranks. Next one should split you."],
  split: ["Dead even. Someone has to defend their pick before the line moves.", "Perfect split. Argue it out.", "50/50. This is how friendships end."],
  lone: ["One person stood alone. They owe the group an explanation.", "There's a lone wolf. Make them defend it.", "Odd one out. Interrogate them."],
  majority: ["The majority wins, but the minority might be right.", "Clear winner. Minority: convince one person to flip.", "Most of you agree. Losers explain themselves."],
};

LB.register({
  id: "wyr",
  name: "Would You Rather",
  emoji: "⚖️",
  color: "#e8451f",
  tagline: "Brutal choices, then a twist.",
  players: "1+",
  tags: ["solo", "duo", "group"],
  rules: [
    "Read both options and tap the one you'd pick.",
    "Solo: after you pick, a twist hits the option you chose. Decide if you'd still pick it.",
    "Pass the phone: everyone votes in secret on the same question, then the split is revealed.",
    "Swipe left for the next question and right to go back. On a keyboard: ← → or 1 2 to pick, Enter for next.",
  ],
  css: `
.wyr { flex: 1; display: flex; flex-direction: column; gap: 10px; min-height: 0; touch-action: pan-y; }
.wyr-prompt { font-size: 15px; font-weight: 600; color: var(--muted); margin: 0; }
.wyr .choices { flex: 1; display: flex; flex-direction: column; position: relative; min-height: 330px; }
.wyr .opt {
  flex: 1; border: 0; text-align: left; border-radius: 22px; padding: 22px 22px 36px;
  display: flex; flex-direction: column; justify-content: flex-end; gap: 10px;
  font-size: clamp(21px, 5.6vw, 27px); line-height: 1.18; font-weight: 700; letter-spacing: -.015em;
  transition: transform .18s ease, opacity .25s ease, filter .25s ease; position: relative; overflow: hidden;
}
.wyr .opt .lbl { font-family: "JetBrains Mono", monospace; font-size: 12px; font-weight: 500; letter-spacing: .08em; opacity: .8; }
.wyr .opt.a { background: var(--a); color: var(--on-accent); }
.wyr .opt.b { background: var(--b); color: var(--on-accent); justify-content: flex-start; padding: 36px 22px 22px; }
.wyr .opt.b .lbl { order: 2; }
.wyr .opt:active { transform: scale(.985); }
.wyr .or {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 52px; height: 52px; border-radius: 50%;
  background: var(--bg); color: var(--ink); display: grid; place-items: center; font-weight: 800; font-size: 15px; z-index: 2;
  border: 6px solid var(--bg); box-shadow: 0 0 0 1px var(--line);
}
.wyr .gap { height: 8px; flex: none; }
.wyr .choices.decided { flex: none; min-height: 0; }
.wyr .choices.decided .opt { pointer-events: none; font-size: clamp(17px, 4.4vw, 21px); padding: 16px 18px 26px; gap: 6px; flex: none; }
.wyr .choices.decided .opt.b { padding: 26px 18px 16px; }
.wyr .choices.decided .or { width: 42px; height: 42px; font-size: 13px; border-width: 5px; }
.wyr .choices.decided .opt:not(.picked) { opacity: .3; filter: saturate(.3); }
.wyr .opt .check { position: absolute; right: 16px; top: 16px; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.24); display: none; place-items: center; }
.wyr .opt.picked .check { display: grid; }
.wyr .opt .check svg { width: 16px; height: 16px; stroke: #fff; stroke-width: 3; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.wyr .opt .bar { position: absolute; left: 0; bottom: 0; height: 5px; background: rgba(255,255,255,.6); width: 0; transition: width .6s cubic-bezier(.2,.8,.2,1); }
.wyr .opt.b .bar { top: 0; bottom: auto; }
.wyr .panel h3 { margin: 0 0 2px; font-size: 11.5px; font-family: "JetBrains Mono", monospace; font-weight: 500; letter-spacing: .08em; color: var(--muted); text-transform: uppercase; }
.wyr .panel p { margin: 0 0 12px; font-size: 17px; font-weight: 700; line-height: 1.25; letter-spacing: -.01em; }
.wyr .panel .btn[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.wyr .split { display: flex; height: 10px; border-radius: 99px; overflow: hidden; margin: 6px 0 8px; background: var(--line); }
.wyr .split span { display: block; height: 100%; transition: width .5s ease; }
.wyr .split-legend { display: flex; justify-content: space-between; font-size: 14px; color: var(--muted); margin-bottom: 10px; }
.wyr .split-legend b { color: var(--ink); }
.wyr.answered .mode-row { display: none; }
@media (min-height: 820px) { .wyr .choices { min-height: 430px; } }
`,
  mount(root, S) {
    const store = LB.store;
    const st = {
      cat: store.get("wyr:cat", "all"),
      mode: store.get("wyr:mode", "solo"),
      answered: store.get("wyr:answered", store.get("answered", 0)),
      history: [], hIndex: -1, current: null, picked: null, votes: [], voter: 0,
    };
    if (!["all", ...Object.keys(CATS)].includes(st.cat)) st.cat = "all";
    if (!["solo", "group"].includes(st.mode)) st.mode = "solo";

    const el = LB.h(`
<div class="wyr">
  <div class="slot-chips"></div>
  <div class="mode-row stack"></div>
  <div class="meta mono"><span class="tag"><span class="dot"></span><span class="cname"></span></span><span class="left"></span></div>
  <p class="wyr-prompt">Would you rather…</p>
  <div class="choices">
    <button class="opt a"><span class="lbl">A</span><span class="txt"></span><span class="check"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></span><span class="bar"></span></button>
    <div class="gap"></div>
    <button class="opt b"><span class="lbl">B</span><span class="txt"></span><span class="check"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></span><span class="bar"></span></button>
    <div class="or" aria-hidden="true">OR</div>
  </div>
  <section class="panel twist hidden" aria-live="polite">
    <h3>Okay, but now</h3>
    <p class="twist-text"></p>
    <div class="row"><button class="btn keep">Still picking it</button><button class="btn switch">I'd switch</button></div>
  </section>
  <section class="panel reveal hidden" aria-live="polite">
    <h3>The line has spoken</h3>
    <div class="split"><span class="sa" style="background:var(--a)"></span><span class="sb" style="background:var(--b)"></span></div>
    <div class="split-legend"><span><b class="na">0</b> picked A</span><span><b class="nb">0</b> picked B</span></div>
    <p class="reveal-text"></p>
  </section>
  <div class="spacer"></div>
  <div class="bottom">
    <button class="icon-btn back" aria-label="Previous question">${LB.icon.back}</button>
    <button class="btn primary big next">Skip</button>
    <button class="icon-btn share" aria-label="Share this question">${LB.icon.share}</button>
  </div>
</div>`);
    root.appendChild(el);
    const q = (s) => el.querySelector(s);
    const optA = q(".opt.a"), optB = q(".opt.b"), choices = q(".choices");
    const twist = q(".twist"), reveal = q(".reveal"), next = q(".next"), back = q(".back");

    const chipOpts = [{ id: "all", name: "Everything", color: "var(--ink)" }, ...Object.entries(CATS).map(([id, c]) => ({ id, name: c.name, color: c.color }))];
    q(".slot-chips").replaceWith(LB.chips(chipOpts, st.cat, (c) => { st.cat = c; store.set("wyr:cat", c); newQuestion(); }));

    const pbar = LB.playersBar({ min: 2, max: 12 });
    const modeSeg = LB.seg([["solo", "Solo"], ["group", "Pass the phone"]], st.mode, (m) => {
      st.mode = m; store.set("wyr:mode", m); pbar.classList.toggle("hidden", m !== "group"); show(st.current);
    });
    pbar.classList.toggle("hidden", st.mode !== "group");
    q(".mode-row").append(modeSeg, pbar);

    const pool = () => Q.map((_, i) => i).filter((i) => st.cat === "all" || Q[i][0] === st.cat);
    let deck = null, deckCat = null;
    const getDeck = () => { if (deckCat !== st.cat) { deck = LB.deck("wyr:" + st.cat, pool().length); deckCat = st.cat; } return deck; };

    function newQuestion() {
      const p = pool(), d = getDeck();
      const curPos = st.current != null ? p.indexOf(st.current) : -1;
      const idx = p[d.next(curPos >= 0 ? curPos : null)];
      st.history = st.history.slice(0, st.hIndex + 1);
      st.history.push(idx);
      st.hIndex = st.history.length - 1;
      show(idx);
    }

    function show(idx) {
      st.current = idx; st.picked = null; st.votes = []; st.voter = 0;
      const [cat, a, b] = Q[idx];
      q(".tag .dot").style.background = CATS[cat].color;
      q(".cname").textContent = CATS[cat].name.toUpperCase();
      optA.querySelector(".txt").textContent = a;
      optB.querySelector(".txt").textContent = b;
      choices.classList.remove("decided"); el.classList.remove("answered");
      optA.classList.remove("picked"); optB.classList.remove("picked");
      optA.querySelector(".bar").style.width = "0"; optB.querySelector(".bar").style.width = "0";
      twist.classList.add("hidden"); reveal.classList.add("hidden");
      q(".keep").removeAttribute("aria-pressed"); q(".switch").removeAttribute("aria-pressed");
      next.textContent = "Skip";
      back.disabled = st.hIndex <= 0;
      q(".left").textContent = `${getDeck().left()} left · ${st.answered} answered`;
      if (st.mode === "group") {
        const players = LB.players();
        LB.pass({ to: players[0], sub: "New question. Read it to yourself, pick in secret, then pass it on.", button: "Show me" });
      }
    }

    function markPicked(which) {
      choices.classList.add("decided"); el.classList.add("answered");
      (which === "a" ? optA : optB).classList.add("picked");
      LB.buzz(12); LB.sfx.tap();
    }
    function commitAnswered() {
      st.answered += 1; store.set("wyr:answered", st.answered);
      q(".left").textContent = `${getDeck().left()} left · ${st.answered} answered`;
    }

    function choose(which) {
      if (st.current == null || st.picked != null || LB.modalOpen()) return;
      if (st.mode === "group") return groupVote(which);
      st.picked = which;
      markPicked(which);
      commitAnswered();
      q(".twist-text").textContent = Q[st.current][which === "a" ? 3 : 4];
      twist.classList.remove("hidden");
      next.textContent = "Next one →";
    }

    function groupVote(which) {
      const players = LB.players();
      st.votes.push(which); st.voter += 1; LB.buzz(12); LB.sfx.tap();
      if (st.voter < players.length) {
        LB.pass({ to: players[st.voter], sub: "Hand it over. Pick in secret." , button: "Show me" });
        return;
      }
      st.picked = "group";
      commitAnswered();
      const nA = st.votes.filter((v) => v === "a").length, nB = st.votes.length - nA;
      choices.classList.add("decided"); el.classList.add("answered");
      if (nA >= nB) optA.classList.add("picked");
      if (nB >= nA) optB.classList.add("picked");
      const pa = Math.round((nA / st.votes.length) * 100);
      optA.querySelector(".bar").style.width = pa + "%";
      optB.querySelector(".bar").style.width = 100 - pa + "%";
      q(".sa").style.width = pa + "%"; q(".sb").style.width = 100 - pa + "%";
      q(".na").textContent = nA; q(".nb").textContent = nB;
      const kind = nA === 0 || nB === 0 ? "unanimous" : nA === nB ? "split" : Math.min(nA, nB) === 1 ? "lone" : "majority";
      q(".reveal-text").textContent = LB.pick(GROUP_LINES[kind]);
      reveal.classList.remove("hidden");
      next.textContent = "Next one →";
      LB.sfx.end();
    }

    function twistAnswer(sw) {
      q(".keep").setAttribute("aria-pressed", String(!sw));
      q(".switch").setAttribute("aria-pressed", String(sw));
      if (sw && (st.picked === "a" || st.picked === "b")) {
        const other = st.picked === "a" ? "b" : "a";
        optA.classList.remove("picked"); optB.classList.remove("picked");
        (other === "a" ? optA : optB).classList.add("picked");
        st.picked = other + "!";
        LB.toast("Flipped. Interesting.");
      } else if (!sw) LB.toast("Holding the line.");
    }

    optA.onclick = () => choose("a");
    optB.onclick = () => choose("b");
    q(".keep").onclick = () => twistAnswer(false);
    q(".switch").onclick = () => twistAnswer(true);
    const goNext = () => {
      if (st.hIndex < st.history.length - 1) { st.hIndex += 1; show(st.history[st.hIndex]); }
      else newQuestion();
    };
    const goBack = () => { if (st.hIndex > 0) { st.hIndex -= 1; show(st.history[st.hIndex]); } };
    next.onclick = goNext;
    back.onclick = goBack;
    q(".share").onclick = () => { const [, a, b] = Q[st.current]; LB.share(`Would you rather…\nA) ${a}\nB) ${b}`); };

    S.on(document, "keydown", (e) => {
      if (LB.modalOpen() || LB.typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "ArrowLeft" || k === "1" || k === "a" || k === "A") choose("a");
      else if (k === "ArrowRight" || k === "2" || k === "b" || k === "B") choose("b");
      else if (k === "Enter" || k === " ") { if (document.activeElement && document.activeElement.tagName === "BUTTON") return; e.preventDefault(); goNext(); }
      else if (k === "Backspace") goBack();
    });
    LB.swipe(S, el, { left: goNext, right: goBack });

    newQuestion();
  },
});
})();
