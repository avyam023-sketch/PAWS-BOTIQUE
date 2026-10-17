/*
 * Paws Boutique — site content.
 * Everything a non-developer should edit lives here: business details, breeds, promises, FAQs.
 * Used by the build (Node) and in the browser (window.PB).
 *
 * BEFORE LAUNCH: replace every value marked TODO. The build prints a warning while any remain.
 */
(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.PB = data;
})(typeof self !== "undefined" ? self : this, function () {
  const company = {
    name: "Paws Boutique",
    short: "Paws",
    city: "Amritsar",
    region: "Punjab",
    // TODO: client's real numbers. `phone` is dialled, `whatsapp` is digits only with country code.
    phone: "+910000000000",
    phoneDisplay: "+91 00000 00000",
    whatsapp: "910000000000",
    email: "hello@pawsboutique.in", // TODO
    address: "Amritsar, Punjab", // TODO: full street address
    hours: "Open daily, 10 am – 8 pm", // TODO
    mapUrl: "https://maps.google.com/?q=Amritsar,+Punjab", // TODO: the shop's Google Maps link
    instagram: "", // TODO: optional, e.g. https://instagram.com/pawsboutique
    siteUrl: "https://pawsboutique.in", // TODO: final domain (used for sitemap + canonical URLs)
    // Optional: an n8n (or any) webhook that receives quote requests as JSON.
    // Leave empty and every request opens WhatsApp with the details pre-filled.
    leadWebhook: "",
  };

  const sizes = [
    { id: "toy", label: "Toy", weight: "Under 5 kg", fit: "Flats, first-time owners, laps", scale: 0.42 },
    { id: "small", label: "Small", weight: "5 – 14 kg", fit: "Flats and busy families", scale: 0.58 },
    { id: "medium", label: "Medium", weight: "14 – 30 kg", fit: "Active homes with some space", scale: 0.74 },
    { id: "large", label: "Large", weight: "25 – 60 kg", fit: "Families, houses, guarding", scale: 0.88 },
    { id: "giant", label: "Giant", weight: "50 kg and up", fit: "Large homes and experienced owners", scale: 1 },
  ];

  /*
   * Breed facts are general breed-standard information (lifespan, adult weight, temperament).
   * heat: how the breed copes with a Punjab summer — "good", "moderate" or "ac" (needs air-conditioning).
   * coat: two colours used for the card art until real photos are added (src/assets/img/breeds/<id>.webp).
   * featured: shown on the homepage.
   */
  const breeds = [
    // Toy
    { id: "pomeranian", name: "Pomeranian", size: "toy", origin: "Germany", life: "12–16 yrs", weight: "1.8–3.5 kg", traits: ["Bold", "Lively", "Alert"], kids: "Older kids", flat: true, grooming: "High", energy: "Medium", heat: "moderate", coat: ["#E39A4B", "#F6D3A3"], featured: true,
      blurb: "A big personality in a three-kilo frame. Pomeranians are bright, easy to carry, and happy in a flat — with a thick double coat that needs brushing a few times a week." },
    { id: "shih-tzu", name: "Shih Tzu", size: "toy", origin: "Tibet", life: "10–16 yrs", weight: "4–7.5 kg", traits: ["Affectionate", "Outgoing", "Calm"], kids: "Yes", flat: true, grooming: "High", energy: "Low", heat: "moderate", coat: ["#C9A27A", "#F3EDE4"], featured: true,
      blurb: "Bred to be a companion and nothing else. Shih Tzus are gentle, low-energy and very attached to their people — one of the easiest breeds for a flat." },
    { id: "toy-poodle", name: "Toy Poodle", size: "toy", origin: "France", life: "14–18 yrs", weight: "2–3 kg", traits: ["Clever", "Gentle", "Low-shedding"], kids: "Older kids", flat: true, grooming: "High", energy: "Medium", heat: "good", coat: ["#7A5136", "#D9B48F"],
      blurb: "One of the most trainable dogs there is, with a coat that sheds very little. A good choice for homes where hair on the sofa is a concern." },
    { id: "maltese", name: "Maltese", size: "toy", origin: "Malta", life: "12–15 yrs", weight: "Under 4 kg", traits: ["Gentle", "Playful", "Charming"], kids: "Older kids", flat: true, grooming: "High", energy: "Medium", heat: "good", coat: ["#EDE6DA", "#FFFFFF"],
      blurb: "A small white companion with a silky coat and a friendly nature. Maltese stay puppy-like and playful well into adulthood." },
    { id: "chihuahua", name: "Chihuahua", size: "toy", origin: "Mexico", life: "14–16 yrs", weight: "Up to 3 kg", traits: ["Loyal", "Sassy", "Alert"], kids: "Older kids", flat: true, grooming: "Low", energy: "Medium", heat: "good", coat: ["#D8A46A", "#F4E2C6"],
      blurb: "The smallest breed in the world and one of the longest-lived. Fiercely loyal to one person, and well suited to warm weather." },
    { id: "yorkshire-terrier", name: "Yorkshire Terrier", size: "toy", origin: "England", life: "11–15 yrs", weight: "About 3 kg", traits: ["Brave", "Affectionate", "Spirited"], kids: "Older kids", flat: true, grooming: "High", energy: "Medium", heat: "moderate", coat: ["#3B4A5A", "#C8995C"],
      blurb: "A terrier's confidence in a toy-sized dog. Yorkies have a fine, hair-like coat that sheds very little." },

    // Small
    { id: "pug", name: "Pug", size: "small", origin: "China", life: "13–15 yrs", weight: "6–8 kg", traits: ["Charming", "Even-tempered", "Loving"], kids: "Yes", flat: true, grooming: "Low", energy: "Low", heat: "ac", coat: ["#C9A77C", "#3A3129"], featured: true,
      blurb: "Comic, cuddly and content to stay indoors. Pugs are great flat dogs, but their short noses mean they need a cool room through the summer." },
    { id: "beagle", name: "Beagle", size: "small", origin: "England", life: "10–15 yrs", weight: "9–14 kg", traits: ["Merry", "Curious", "Friendly"], kids: "Yes", flat: true, grooming: "Low", energy: "High", heat: "good", coat: ["#B9733F", "#F2EBDF"], featured: true,
      blurb: "Cheerful, sturdy and great with children. Beagles are scent hounds, so they love long walks and will follow their nose anywhere." },
    { id: "french-bulldog", name: "French Bulldog", size: "small", origin: "France", life: "10–12 yrs", weight: "Under 13 kg", traits: ["Easygoing", "Adaptable", "Playful"], kids: "Yes", flat: true, grooming: "Low", energy: "Low", heat: "ac", coat: ["#B8A089", "#E9DFD2"],
      blurb: "Quiet, adaptable and happy in a small space. Like all short-nosed breeds, Frenchies need air-conditioning and gentle exercise in the heat." },
    { id: "lhasa-apso", name: "Lhasa Apso", size: "small", origin: "Tibet", life: "12–15 yrs", weight: "5.5–8 kg", traits: ["Confident", "Independent", "Watchful"], kids: "Older kids", flat: true, grooming: "High", energy: "Low", heat: "moderate", coat: ["#D6B98F", "#F5EDE0"],
      blurb: "Bred as an indoor sentinel in Tibetan monasteries. Calm at home, wary of strangers, and a good small watchdog." },
    { id: "dachshund", name: "Dachshund", size: "small", origin: "Germany", life: "12–16 yrs", weight: "7–15 kg", traits: ["Curious", "Clever", "Spunky"], kids: "Yes", flat: true, grooming: "Low", energy: "Medium", heat: "good", coat: ["#7B3F22", "#C98C5A"],
      blurb: "Long, low and full of character. Dachshunds are brave, funny and devoted — stairs should be kept to a minimum for their backs." },

    // Medium
    { id: "cocker-spaniel", name: "Cocker Spaniel", size: "medium", origin: "England", life: "12–14 yrs", weight: "12–15 kg", traits: ["Gentle", "Happy", "Smart"], kids: "Yes", flat: true, grooming: "Medium", energy: "Medium", heat: "moderate", coat: ["#A2552C", "#E2B07E"],
      blurb: "Soft-natured, eager to please and very good with children. One of the best all-round family dogs of medium size." },
    { id: "siberian-husky", name: "Siberian Husky", size: "medium", origin: "Siberia", life: "12–14 yrs", weight: "16–27 kg", traits: ["Friendly", "Energetic", "Vocal"], kids: "Yes", flat: false, grooming: "Medium", energy: "High", heat: "ac", coat: ["#5E6872", "#F1F2F2"], featured: true,
      blurb: "Striking, sociable and built for snow. A Husky in Amritsar needs an air-conditioned room in summer, early-morning walks and plenty of exercise." },
    { id: "samoyed", name: "Samoyed", size: "medium", origin: "Siberia", life: "12–14 yrs", weight: "16–30 kg", traits: ["Gentle", "Adaptable", "Friendly"], kids: "Yes", flat: false, grooming: "High", energy: "High", heat: "ac", coat: ["#E9E5DD", "#FFFFFF"],
      blurb: "The famous Samoyed smile comes with a gentle, people-loving temperament — and a heavy white coat that needs a cool home and regular grooming." },
    { id: "english-bulldog", name: "English Bulldog", size: "medium", origin: "England", life: "8–10 yrs", weight: "18–23 kg", traits: ["Calm", "Courageous", "Friendly"], kids: "Yes", flat: true, grooming: "Low", energy: "Low", heat: "ac", coat: ["#C69C76", "#F2E8DC"],
      blurb: "Steady, patient and low-energy. Bulldogs are content in a flat but must be kept cool — they do not handle heat well." },

    // Large
    { id: "labrador-retriever", name: "Labrador Retriever", size: "large", origin: "Canada", life: "11–13 yrs", weight: "25–36 kg", traits: ["Friendly", "Outgoing", "Eager to please"], kids: "Yes", flat: false, grooming: "Low", energy: "High", heat: "moderate", coat: ["#E2BE85", "#F6E7C9"], featured: true,
      blurb: "India's favourite family dog for good reason: friendly with everyone, easy to train and wonderful with children. Available in yellow, black and chocolate." },
    { id: "golden-retriever", name: "Golden Retriever", size: "large", origin: "Scotland", life: "10–12 yrs", weight: "25–34 kg", traits: ["Friendly", "Devoted", "Intelligent"], kids: "Yes", flat: false, grooming: "Medium", energy: "High", heat: "moderate", coat: ["#C98B3F", "#EBC88E"], featured: true,
      blurb: "Gentle, patient and endlessly good-natured. Goldens are among the easiest large dogs to live with, if you are ready for some shedding." },
    { id: "german-shepherd", name: "German Shepherd", size: "large", origin: "Germany", life: "9–13 yrs", weight: "22–40 kg", traits: ["Loyal", "Confident", "Courageous"], kids: "Yes", flat: false, grooming: "Medium", energy: "High", heat: "moderate", coat: ["#2B2620", "#B97A3E"], featured: true,
      blurb: "Loyal, intelligent and protective of its family. The first choice for homes that want a companion and a guard dog in one." },
    { id: "rottweiler", name: "Rottweiler", size: "large", origin: "Germany", life: "9–10 yrs", weight: "35–60 kg", traits: ["Loyal", "Confident", "Protective"], kids: "With training", flat: false, grooming: "Low", energy: "Medium", heat: "moderate", coat: ["#1F1B18", "#8E5A2E"],
      blurb: "Calm and devoted with family, serious with strangers. A powerful guardian that needs early socialising and a confident owner." },
    { id: "doberman", name: "Doberman", size: "large", origin: "Germany", life: "10–12 yrs", weight: "27–45 kg", traits: ["Alert", "Fearless", "Loyal"], kids: "With training", flat: false, grooming: "Low", energy: "High", heat: "good", coat: ["#231C18", "#A0582A"],
      blurb: "Sleek, fast and highly trainable. Dobermans bond closely with their family and are natural watchdogs." },
    { id: "boxer", name: "Boxer", size: "large", origin: "Germany", life: "10–12 yrs", weight: "25–32 kg", traits: ["Fun-loving", "Bright", "Patient"], kids: "Yes", flat: false, grooming: "Low", energy: "High", heat: "moderate", coat: ["#B06A35", "#EAD2B4"],
      blurb: "Playful, patient with children and protective when it matters. Boxers keep their puppy energy for years." },

    // Giant
    { id: "great-dane", name: "Great Dane", size: "giant", origin: "Germany", life: "7–10 yrs", weight: "50–80 kg", traits: ["Gentle", "Friendly", "Dependable"], kids: "Yes", flat: false, grooming: "Low", energy: "Medium", heat: "good", coat: ["#3D3F45", "#A9ABB0"],
      blurb: "The gentle giant. Great Danes are calm indoors and surprisingly easy-going — they simply need room to stretch out." },
    { id: "saint-bernard", name: "Saint Bernard", size: "giant", origin: "Switzerland", life: "8–10 yrs", weight: "54–82 kg", traits: ["Gentle", "Patient", "Watchful"], kids: "Yes", flat: false, grooming: "Medium", energy: "Low", heat: "ac", coat: ["#9C4A22", "#F2E6D6"],
      blurb: "Patient and famously kind with children. A mountain dog at heart, so a cool room through the summer is essential." },
    { id: "tibetan-mastiff", name: "Tibetan Mastiff", size: "giant", origin: "Tibet", life: "10–12 yrs", weight: "34–68 kg", traits: ["Independent", "Reserved", "Protective"], kids: "With training", flat: false, grooming: "Medium", energy: "Medium", heat: "ac", coat: ["#4A2E1E", "#B5713D"],
      blurb: "An ancient guardian breed with a lion-like mane. Independent and deeply protective — for experienced owners with space." },
    { id: "cane-corso", name: "Cane Corso", size: "giant", origin: "Italy", life: "9–12 yrs", weight: "40–50 kg", traits: ["Assertive", "Loyal", "Intelligent"], kids: "With training", flat: false, grooming: "Low", energy: "Medium", heat: "good", coat: ["#2E2F33", "#6E6A66"],
      blurb: "A calm, athletic Italian mastiff. Devoted to family and a formidable guardian — best with an owner who will train consistently." },
  ];

  // TODO: confirm each line with the client before launch.
  const promises = [
    { title: "Vet health check", text: "Every puppy is examined by a vet before it goes home." },
    { title: "Vaccinated for age", text: "Vaccinations up to date for the puppy's age, with the record in hand." },
    { title: "Dewormed", text: "Deworming done on schedule, dates written down." },
    { title: "At least 8 weeks old", text: "No puppy leaves its mother before eight weeks." },
    { title: "Diet & care chart", text: "What to feed, how much, and when — for the first months." },
    { title: "WhatsApp support", text: "Questions after you take your puppy home? Message us." },
  ];

  const steps = [
    { title: "Tell us the breed", text: "Tap View Price on any breed, or call us. Takes under a minute." },
    { title: "Get photos, videos & price", text: "We send the available puppies, their parents and the price on WhatsApp." },
    { title: "Meet them in Amritsar", text: "Visit us or do a live video call. Choose with no pressure." },
    { title: "Take your puppy home", text: "With the vaccination record, diet chart and our number on speed dial." },
  ];

  // TODO: confirm answers with the client.
  const faqs = [
    { q: "Why don't you show prices online?", a: "Price depends on the breed, the parents, coat colour and whether the puppy is KCI-registered. Prices also change with each litter. Tell us what you are looking for and we will send you the exact price of the puppies available right now." },
    { q: "Can I see the puppy before I pay?", a: "Yes. Visit us in Amritsar, or ask for a live video call and we will show you the puppy and its parents." },
    { q: "Do the puppies come with KCI papers?", a: "KCI-registered puppies are available for many breeds. Ask when you request a price and we will tell you which puppies have papers." },
    { q: "Which breeds suit an Amritsar summer?", a: "Short-coated breeds like the Labrador, Beagle, Doberman and Great Dane cope well. Short-nosed breeds (Pug, French and English Bulldog) and heavy-coated breeds (Husky, Samoyed, Saint Bernard) need an air-conditioned room from April to September. We will always tell you honestly." },
    { q: "Do you deliver outside Amritsar?", a: "Tell us your city when you request a price and we will confirm delivery options and timing." },
    { q: "What support do I get after I take the puppy home?", a: "You get a diet and care chart, the vaccination schedule, and our WhatsApp number for any question in the first months." },
  ];

  // The 3D puppy in the hero cycles through these coats; the headline names each one.
  const heroBreeds = [
    { coat: "labrador", word: "Labrador", breed: "labrador-retriever" },
    { coat: "husky", word: "Husky", breed: "siberian-husky" },
    { coat: "golden", word: "Golden", breed: "golden-retriever" },
    { coat: "shepherd", word: "Shepherd", breed: "german-shepherd" },
    { coat: "pomeranian", word: "Pom", breed: "pomeranian" },
    { coat: "beagle", word: "Beagle", breed: "beagle" },
  ];

  return { company, sizes, breeds, promises, steps, faqs, heroBreeds };
});
