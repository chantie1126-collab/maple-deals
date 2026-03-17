import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Search,
  Tag,
  ShoppingBag,
  Flame,
  MapPin,
  ChevronRight,
  Star,
  Zap,
  Instagram,
  Facebook,
  Pin,
} from "lucide-react";

const deals = [
  {
    id: 1,
    title: "Corsair iCUE 2000D Airflow Mini-ITX Case",
    category: "Tech",
    price: "$134.90",
    oldPrice: "$214.99",
    discount: "37% OFF",
    description:
      "Compact, powerful, and built for serious airflow. Perfect for small-form-factor builds while still keeping your system cool and looking amazing with RGB lighting.",
    link: "https://amzn.to/4rDYSSl",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/653783829_122105505945284106_743019173377568284_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_ohc=10kwt-u7PzUQ7kNvwFeSmUR&_nc_oc=AdlTu0VpoLymuWJjH0FRLnNrCw7pN5dFnoGqXPJlX52sQosoMeOs53g2QSux9Ams3fI&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=tKKsxwPWvnRSJ2zAv3fSzA&_nc_ss=8&oh=00_AfxvyqDqOrPFLYNP51j48V4Joox2cd6Vl2568L_nrolJWg&oe=69BF6F63",
    featured: true,
  },
  {
    id: 2,
    title: "2-pack of Chyardna Outdoor Pickleballs",
    category: "Sports",
    price: "$24.99",
    oldPrice: "$35.96",
    discount: "31% OFF",
    description: "Perfect for outdoor courts with a consistent bounce and durable design.",
    link: "https://amzn.to/4rTv6JP",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/651217087_122105505609284106_1606019154870323328_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=13d280&_nc_ohc=BSUYgk46XjQQ7kNvwHTBpHd&_nc_oc=AdmwM3ofVn-Jgj8rnW3HBELQ4LcgyvE1Wo1JMVoJtQGp4OJCg-h4Ng4SqavFcp-KXrc&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=V_DydBe51xX9-UlTQl5OVg&_nc_ss=8&oh=00_Afy591T5ZkmfTZb_TROHKoNHQlsE_Q6So_aFdY39h7njDA&oe=69BF52A1",
    featured: true,
  },
  {
    id: 3,
    title: "Olive Green Insulated Dog Vest",
    category: "Pets",
    price: "$21.19",
    oldPrice: "$38.99",
    discount: "46% OFF",
    description:
      "Perfect for chilly walks or outdoor adventures, it’s designed to be windproof, reflective for safety, and adjustable for a comfy fit.",
    link: "https://amzn.to/4rTv6JP",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/617469756_122105504505284106_6870213715669604674_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_ohc=15pHYsPzivAQ7kNvwESYTPT&_nc_oc=Adn2tl5Z2OlNUmZ4qbQq66l9EWVKkq-smXGqecqy07VkJdWHlaOKhg94wRcU86OR3Co&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=UnztZevcD5RRiFMFYjKdPw&_nc_ss=8&oh=00_AfwTSO4W3MiZvIPQAzyBAH23B0SVJx1s-5iPoqEyoV6_2w&oe=69BF5323",
    featured: true,
  },
  {
    id: 4,
    title: "Anti-anxiety Cuddler Pet Bed",
    category: "Pets",
    price: "$18.35",
    oldPrice: "$26.99",
    discount: "32% OFF",
    description:
      "The plush donut design helps pets feel safe and relaxed while they nap, and the fluffy material is perfect for cats and small dogs who love to curl up. Even better — it’s machine washable, so it stays fresh and clean.",
    link: "https://amzn.to/4lu8KN4",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/651805941_122105501697284106_3048046642186407961_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=13d280&_nc_ohc=YQw2UUQ4IVAQ7kNvwGbyO3V&_nc_oc=AdlsuhrhdE6KneSda8PjGvCBkPwsTe13sWldgxfLRJ-gAP_Hfwepy9TbiMaPpXOVtbk&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=spf9hL01O5a-TgSeT5Cjcw&_nc_ss=8&oh=00_AfwGLtGkFxitQireJCx6FrFT6w0ufq-1QjYKR38D_2ZSSg&oe=69BF73CE",
    featured: true,
  },
  {
    id: 5,
    title: "Kinder Mini Chocolate Bars",
    category: "Home",
    price: "$13.26",
    oldPrice: "$19.99",
    discount: "34% OFF",
    description:
      "These individually wrapped mini bars are perfect for sharing, lunchboxes, or a quick chocolate fix anytime.",
    link: "https://amzn.to/4bCL9Xc",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/650824236_122104715721284106_2281936887730197219_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=13d280&_nc_ohc=M846t3hPRIYQ7kNvwF9jl02&_nc_oc=Adml1WG01a3mf33Wyh5niDpP87eJUfFlLg1uXCjhqEQVlNjlTX2lQoVHsWvlv-zExUw&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=WQnqO1668L6HF9QjC2WwUA&_nc_ss=8&oh=00_Afwuia_LlZW4yXTTwqDTECy3wINMNcOMsuKwMX2BdEfyOw&oe=69BF6A70",
    featured: false,
  },
  {
    id: 6,
    title: "Philips Fully Automatic Espresso Machine",
    category: "Home",
    price: "$799.99",
    oldPrice: "$1,199.99",
    discount: "33% OFF",
    description: "Perfect for espresso lovers who want barista-quality drinks without leaving home.",
    link: "https://amzn.to/4sFL22Y",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/650838775_122104713645284106_4452245523574452269_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=13d280&_nc_ohc=aEOpByEgIjkQ7kNvwH3E_Eh&_nc_oc=AdljwRX0mw1hOB1_yi9WL6XYKjaxtXIS8VjbQuvtWHJIGzxd8jQmYV_5JhFXlWMOMOU&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=6TmR2Ape6C-O0P_ceKTXXA&_nc_ss=8&oh=00_AfzD7dFBcSH9ZHuRd2-LFWWdJr1zT4g8bqs8Giagv0eRaQ&oe=69BF7315",
    featured: true,
  },
  {
    id: 7,
    title: "Conair Automatic Curling Iron",
    category: "Beauty",
    price: "$66.49",
    oldPrice: "$99.99",
    discount: "34% OFF",
    description:
      "This smart curler automatically wraps your hair for effortless, beautiful curls in minutes. Perfect for quick styling with professional results!",
    link: "https://amzn.to/4ukKHo5",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/650340450_122104713405284106_6146166566072537853_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_ohc=DlXe7trgBcEQ7kNvwH2j5T-&_nc_oc=AdkpLYHYpUSx_pIbJpbH2ahjnVaRqlgpi5V0HVuXuQ8QHc1BZCxrESStc_FEcOMGGr4&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=xVLHjULL4yUxeZP-LqPhZw&_nc_ss=8&oh=00_AfwctS7QxuhNoGFGIOPjcUudbNX1joZHtiOdI11i-Wn4Ow&oe=69BF556D",
    featured: true,
  },
  {
    id: 8,
    title: "Firming White Eye Masks",
    category: "Beauty",
    price: "$33.00",
    oldPrice: "$50.00",
    discount: "Deal",
    description: "Packed with powerful peptides that deliver a lifting and tightening boost.",
    link: "https://tidd.ly/4ujiCNL",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/651208496_122104711287284106_5217469916433165065_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=13d280&_nc_ohc=wtXIkN0zCeAQ7kNvwFVTima&_nc_oc=AdkbNAPFopLTcAdC7g5-54SuxRqCEyFw4rE3QXVQz3KwPVm3jfll4jjDX0wdpTrO9Hs&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=-ie-tdeCEIDQV5GIDKiiEw&_nc_ss=8&oh=00_AfwXi9pmxIO9wQSKRmXLmhxFenXI-Y-bQy214kVdwcHugQ&oe=69BF52DB",
    featured: true,
  },
  {
    id: 9,
    title: "Weekend Rest Edit Gift Set",
    category: "Beauty",
    price: "$39.00",
    oldPrice: "$87.00",
    discount: "Deal",
    description: "Turns tired weekend skin into Monday-ready radiance overnight.",
    link: "https://tidd.ly/4s6l4Wk",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/650265758_122104701915284106_5394893441388473311_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=13d280&_nc_ohc=NmtsfUpLUjcQ7kNvwG3JVSV&_nc_oc=AdmG1nZ0ID8REznjqL8gkg4KqhSNDreb5OGspR2ilhduDDUECHbXHL-Th2xcn2SNcfI&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=IGxRGDubjC2QgwLLxmx7sg&_nc_ss=8&oh=00_AfxEr0Rv1nlIHTWlHfffKr0bNir7-p9ttpIc-mtypHgmlA&oe=69BF617F",
    featured: false,
  },
  {
    id: 10,
    title: "Blink Mini 2K Indoor Security Camera",
    category: "Home",
    price: "$38.99",
    oldPrice: "$59.99",
    discount: "35% OFF",
    description:
      "This compact camera delivers 2K video, motion detection alerts, and easy setup, making it perfect for monitoring your space from anywhere.",
    link: "https://amzn.to/4uuynBN",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/649594698_122104624515284106_4533638958249445340_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=13d280&_nc_ohc=zOCMCNg9TPEQ7kNvwHCNfrb&_nc_oc=AdmEYC3Sbdh3x9Zl6Pmom0CNomWLgdNnE5zuBtQgb7cTdPFzrwUCiMLGfZYu9v78Mtc&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=_2L6-F8_265Q5WPNb1L4mg&_nc_ss=8&oh=00_AfzFVPZ-8uLTHRj-skeEA0mxsrSSuDRtUhVFg1vHEvq7IQ&oe=69BF7F63",
    featured: true,
  },
  {
    id: 11,
    title: "Blink Outdoor 2K Security Camera System",
    category: "Home",
    price: "$194.99",
    oldPrice: "$299.99",
    discount: "35% OFF",
    description:
      "Perfect for keeping an eye on your home, yard, or garage — and at this price, it’s a deal you don’t want to miss!",
    link: "https://amzn.to/40pyGzR",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/651077302_122104622967284106_2055343585470864116_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=7RU91eevL7sQ7kNvwHl_mNH&_nc_oc=Admv4duuGoE5X03lLk-j5eFFbSIH0f8P0rk17zF9g6-3JaOW7V38ist6mSvE1Rhst1k&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=5HZ4p4lHO96W0l66of1exg&_nc_ss=8&oh=00_AfzdckOZg6sZi6UQGz6F4K5EzbZwogS41BXSWis-VrYlYw&oe=69BF5633",
    featured: true,
  },
  {
    id: 12,
    title: "The KitchenAid Mini Food Processor",
    category: "Home",
    price: "$49.98",
    oldPrice: "$79.99",
    discount: "38% OFF",
    description:
      "Perfect for chopping, mixing, and prepping ingredients quickly. A compact powerhouse that’s great for everyday cooking!",
    link: "https://amzn.to/4b0ri48",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/650837759_122104610613284106_5330310656843677095_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=13d280&_nc_ohc=gcn9-E-gL6gQ7kNvwG50vfX&_nc_oc=AdmMIVS3LG9MSJ65BnouPQyqkKxoq4oiXxtV_RqXHGKZe0ViqPjUGIbDZTg13_7syvU&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=bIcFsAtdA1wqn6K_-WJuIQ&_nc_ss=8&oh=00_AfwVk2Osnqj7PDHDaok8bD85Pf82QF-JixCtBolslEonqw&oe=69BF6479",
    featured: false,
  },
  {
    id: 13,
    title: "BLACK+DECKER Dustbuster Cordless Handheld Vacuum",
    category: "Home",
    price: "$84.99",
    oldPrice: "$184.56",
    discount: "54% OFF",
    description:
      "Keep your home and car spotless with the BLACK+DECKER Dustbuster Cordless Handheld Vacuum — now 54% OFF for a limited time!",
    link: "https://amzn.to/4sDzfSM",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/649831904_122104606593284106_6160842278485633926_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_ohc=HDbx4ZpHG2IQ7kNvwGA3LDp&_nc_oc=AdlL8MmeF9_nadWiOESqimwrnjclYsS-pUbWK09x-dDYNX6OSSGerqbniW5EfWN8ftg&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=PPBKudlfhc3AIaLIvCSyRA&_nc_ss=8&oh=00_AfzRyTdV63J8-2rkqkdI2vNvTPavREekU-WkyXM_Cyf2bQ&oe=69BF5B97",
    featured: true,
  },
  {
    id: 14,
    title: "Samsung Essential Monitor S3",
    category: "Office",
    price: "$138.00",
    oldPrice: "$209.99",
    discount: "34% OFF",
    description:
      "Looking for a bigger, better screen for work, gaming, or streaming? The Samsung Essential Monitor S3 is now 34% OFF for a limited time on Amazon!",
    link: "https://amzn.to/4sE34CO",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/648641953_122104517865284106_5279375563410518724_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=13d280&_nc_ohc=mVn0nLj7mT8Q7kNvwHfam69&_nc_oc=AdmS7Rlopa_UVPnH2xqheZaPA2kM4Qagf4N9I0KOhA3crJFb-ODk8R6o9IAUSDsreTU&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=ibBOnrofWkvJ7pGvkKSFGQ&_nc_ss=8&oh=00_Afx4s87j5mD-L7b4o8h_62qJkzXbAUDkCN89DzwWIGzi4w&oe=69BF6667",
    featured: true,
  },
  {
    id: 15,
    title: "Delta Bathroom Faucet",
    category: "Home",
    price: "$217.62",
    oldPrice: "$362.71",
    discount: "40% OFF",
    description:
      "Perfect for modern bathrooms, this stylish matte black faucet adds a clean, elegant look while delivering reliable performance.",
    link: "https://amzn.to/46Spwj9",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/651171541_122104515591284106_5137908326575438461_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_ohc=2tQFrvnNgNwQ7kNvwEwAbxd&_nc_oc=Admo_Evv0xQdci9LYVc2kHT8ZVt3l-29oMnqNH1uvq6E_6bTbIgvofi39XRBBX3Y4KU&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=BfhwzB65TCKDEt0iOspG7g&_nc_ss=8&oh=00_AfykhstlG64A9m4HBa61QDbOdaRusdSk04EnF25-M9SxCQ&oe=69BF667B",
    featured: true,
  },
  {
    id: 16,
    title: "Delta Champagne Bronze Pull-Down Kitchen Faucet",
    category: "Home",
    price: "$414.06",
    oldPrice: "$690.10",
    discount: "40% OFF",
    description:
      "Perfect for anyone doing a kitchen upgrade or renovation. Deals like this on Delta faucets don’t last long!",
    link: "https://amzn.to/47CKEtR",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/649174457_122104290369284106_6859469052916515609_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_ohc=6OLS9T3vgMYQ7kNvwHdjJJv&_nc_oc=AdliWHYbqbamcAiOsRnIGE1BScApfiGa3-QqXQIskit_vNDbyBGYAVz6xR8z6f3q14s&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=vysdCrzkP7CDY_queJrM7w&_nc_ss=8&oh=00_Afwlf8F8ISPHLa2lODXyMUtIRqqt9Xz1drXBSuFOSv0hMg&oe=69BF7B33",
    featured: true,
  },
  {
    id: 17,
    title: "Leviton WR GFCI Receptacle",
    category: "Home",
    price: "$23.80",
    oldPrice: "$37.87",
    discount: "37% OFF",
    description:
      "This weather-resistant & tamper-resistant outlet helps protect against electrical shock and is built to handle moisture and outdoor conditions.",
    link: "https://amzn.to/4uaSPau",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/648025813_122104290153284106_4010026851916844751_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=13d280&_nc_ohc=Sh7mHQVq_nwQ7kNvwGt6Var&_nc_oc=AdkM9atAMNsSKivioqi4Q13FBI32v8GWA9diKZa6-wZLfiL0m1mTqpgVb2EHN_r8-FQ&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=-xkl8P5usqllDFsuTvJwCA&_nc_ss=8&oh=00_AfxF8voXosCa5TUAaZIdXt2r1Y4A8lCkf4p_Y1PZmaNoLw&oe=69BF6545",
    featured: true,
  },
  {
    id: 18,
    title: "DCB118 Fast Charger",
    category: "Home",
    price: "$101.60",
    oldPrice: "$159.00",
    discount: "36% OFF",
    description:
      "This charger powers up compatible batteries in under an hour and includes hot/cold delay protection to keep your batteries performing at their best.",
    link: "https://amzn.to/4bxWg3E",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/649666616_122104292337284106_3870008893372374865_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_ohc=zKAObWkqxnMQ7kNvwH5yxLN&_nc_oc=Adk07_Xr6HbWiK3fnxk-1Pyncf6gZmT077ZM9UDvfDmWnxPBjprsjtDzj9eYCFqsGZw&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=TC8ip23Ejkb9zLp4UB0Rzg&_nc_ss=8&oh=00_AfxKJP_83NFg2C0lTancadTrrRPakcliCzJD7HwCpJamig&oe=69BF4EBB",
    featured: false,
  },
  {
    id: 19,
    title: "Bedsure Satin Pillowcase",
    category: "Bed",
    price: "$12.79",
    oldPrice: "$22.99",
    discount: "44% OFF",
    description:
      "Upgrade your sleep with these Bedsure Satin Pillowcases (2-Pack) – now 44% OFF!",
    link: "https://amzn.to/41apyPW",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/649211986_122104287891284106_2961334528008109578_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=iKD81UYkkZoQ7kNvwH6EuLv&_nc_oc=AdmFqLy3zyjP85rakuK81xTGT-TUETa1REgxNqx7jYhqWFRRpBx47vL_B7liXn-ZK94&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=BaDk6D9mS4hZUh0FVpI0FA&_nc_ss=8&oh=00_AfyaNofOqUEgJYcImYaX6DrCruVblkpimXSJ9zhRJmv8oA&oe=69BF7894",
    featured: false,
  },
  {
    id: 20,
    title: "LUCID Lavender Memory Foam Mattress Topper",
    category: "Bed",
    price: "$130.40",
    oldPrice: "$167.91",
    discount: "22% OFF",
    description:
      "The lavender infusion helps create a calming sleep environment while the ventilated foam improves airflow.",
    link: "https://amzn.to/3PgeCxx",
    image:
      "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/650057536_122104285137284106_3625621977288441211_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=13d280&_nc_ohc=zxZhHntk3FAQ7kNvwFDfVUz&_nc_oc=AdmquE-PDQU2aewrv3k7N0m3aXzj5-goPsPlI-R4NoRGaM2pFWVShZdZtxxqVeLQPr0&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=9MTRamoVvHPoZbDPhWM9xA&_nc_ss=8&oh=00_AfxnIKjLW3czW4AeKLeBn7MleIHwNhDD2Z905O42zvw7Og&oe=69BF7796",
    featured: false,
  },
  {
    id: 21,
    title: "Bedsure Fleece Throw Blanket",
    category: "Bed",
    price: "$17.98",
    oldPrice: "$32.99",
    discount: "45% OFF",
    description:
      "Stay warm and comfortable with this Bedsure Fleece Throw Blanket — perfect for the couch, bed, or movie nights!",
    link: "https://amzn.to/4daIHZ9",
    image:
      "https://scontent.fyto1-2.fna.fbcdn.net/v/t39.30808-6/649206094_122104277889284106_5367594162265336820_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_ohc=N6aszqs0xo8Q7kNvwF5ILtK&_nc_oc=AdmrXG9pZAwwSuk85aLI_UzK1nv7oZsPndgwABDo-2JMA-l412uxZVv7YDRdXWSVNKo&_nc_zt=23&_nc_ht=scontent.fyto1-2.fna&_nc_gid=1xiEwRbCs_2brxaf_6WdiQ&_nc_ss=8&oh=00_AfxvThaWXZE8cRm5ukm6Gkrnr-WroM6EurSqMbe5qJiWCg&oe=69BF8574",
    featured: false,
  },
  {
    id: 22,
    title: "HP DeskJet 4155e Wireless Printer",
    category: "Office",
    price: "$99.99",
    oldPrice: "$189.99",
    discount: "47% OFF",
    description:
      "This is a great budget-friendly printer for students, home offices, or anyone who needs reliable everyday printing.",
    link: "https://amzn.to/4rjt1GF",
    image:
      "https://i.pinimg.com/736x/39/7a/42/397a42c795b628f95cb81a8b41c827b3.jpg",
    featured: false,
  },
  {
    id: 23,
    title: "Quilted Sleeveless Puffer Vest",
    category: "Fashion",
    price: "$38.75",
    oldPrice: "$50.00",
    discount: "23% OFF",
    description:
      "Comfortable, trendy, and a great everyday fall/winter piece. Deals like this don’t last long!",
    link: "https://amzn.to/3P2EqwX",
    image:
      "https://i.pinimg.com/736x/83/16/98/831698136cb4429e2e1c111660e6028c.jpg",
    featured: false,
  },
  {
    id: 24,
    title: "Coleman Portable Tabletop Grill",
    category: "Home",
    price: "$178.30",
    oldPrice: "$178.30",
    discount: "41% OFF",
    description:
      "Take your grilling anywhere with this Coleman Portable Tabletop Grill — perfect for camping, tailgating, road trips, or backyard BBQs.",
    link: "https://amzn.to/4aXCs9K",
    image:
      "https://i.pinimg.com/736x/0c/32/e4/0c32e4b659f72886fddb0e4bda7a998b.jpg",
    featured: false,
  },
  {
    id: 25,
    title: "Eufy Robot Vacuum with Self-Cleaning Station",
    category: "Home",
    price: "$1,199.98",
    oldPrice: "$1,999.99",
    discount: "40% OFF",
    description:
      "If you've been waiting to upgrade to a premium robot vacuum, this is one of the best deals we've seen.",
    link: "https://amzn.to/4llumv9",
    image:
      "https://i.pinimg.com/736x/d0/b5/64/d0b5646a943b311c5cf2205cd5ea2ff7.jpg",
    featured: false,
  },
  {
    id: 26,
    title: "Google Nest WiFi Pro Mesh System",
    category: "Home",
    price: "$149.98",
    oldPrice: "$269.99",
    discount: "44% OFF",
    description:
      "With Wi-Fi 6E technology, this system delivers faster speeds, reduced congestion, and smoother streaming, gaming, and video calls across multiple devices.",
    link: "https://amzn.to/4aQTMxb",
    image:
      "https://i.pinimg.com/736x/4e/29/82/4e29826da991ad80a366209a3433e088.jpg",
    featured: false,
  },
  {
    id: 27,
    title: "Stanley 40oz FlowState Tumbler",
    category: "Home",
    price: "$19.80",
    oldPrice: "$33.00",
    discount: "40% OFF",
    description:
      "These sell out fast whenever they go on sale, so if you've been wanting a Stanley tumbler, now’s the time to grab one!",
    link: "https://amzn.to/3OPZOpm",
    image:
      "https://i.pinimg.com/736x/b1/a5/48/b1a548e14dcf6e9e781b637d6f94400f.jpg",
    featured: false,
  },
  {
    id: 28,
    title: "Bedsure Grey Duvet Cover Set",
    category: "Bed",
    price: "$17.99",
    oldPrice: "$30.94",
    discount: "42% OFF",
    description:
      "This Bedsure Grey Duvet Cover Set is one of those practical deals that’s easy to appreciate. Soft microfiber, a clean modern look, and a price that’s hard to ignore.",
    link: "https://amzn.to/4coSScq",
    image:
      "https://i.pinimg.com/736x/2b/50/d4/2b50d49db5876c4045e4c1ebf0fd964b.jpg",
    featured: false,
  },
];

const categories = ["All", "Tech", "Office", "Sports", "Pets", "Home", "Beauty", "Bed", "Fashion"];

const brand = {
  logo: "https://scontent.fyto1-1.fna.fbcdn.net/v/t39.30808-6/641631710_122098342731284106_8631249794886951697_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=gq3SOlNWMYsQ7kNvwEO16kW&_nc_oc=AdlqTLNT5ncI74suiKjrtDhnnITogqAX6SBxdRLAgp9cTH6tfwFz9Ocrx4BkMyE0_5s&_nc_zt=23&_nc_ht=scontent.fyto1-1.fna&_nc_gid=xoePapzO-aKZbkKYAG6S1g&_nc_ss=8&oh=00_Afz4PIEMQZF9Ie8kM61_4kBJKlNcmxAwKFOVtg28Ts_ZeA&oe=69BF8D3D",
};

const socials = [
  { href: "https://www.instagram.com/dealsmaple/", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/profile.php?id=61588523198142", icon: Facebook, label: "Facebook" },
  { href: "https://ca.pinterest.com/atozdealscanada/", icon: Pin, label: "Pinterest" },
];

function IconLink({ href, icon: Icon, label }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer noopener" aria-label={label}>
      <Icon size={16} />
    </a>
  );
}

function DealCard({ deal }) {
  const hasOldPrice = deal.oldPrice && deal.oldPrice !== deal.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="deal-card"
    >
      <div className="deal-image-wrap">
        <img src={deal.image} alt={deal.title} className="deal-image" loading="lazy" />
        <div className="badge-row">
          <span className="badge badge-hot">{deal.discount}</span>
          <span className="badge badge-light">{deal.category}</span>
        </div>
      </div>

      <div className="deal-body">
        <h3 className="deal-title">{deal.title}</h3>
        <p className="deal-description">{deal.description}</p>

        <div className="price-row">
          <span className="price-current">{deal.price}</span>
          {hasOldPrice ? <span className="price-old">{deal.oldPrice}</span> : null}
        </div>

        <div className="deal-footer">
          <span className="deal-pick">Maple Deals Pick</span>
          <a className="deal-button" href={deal.link} target="_blank" rel="noreferrer noopener">
            View Deal <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedCard({ deal }) {
  return (
    <div className="featured-card">
      <img src={deal.image} alt={deal.title} className="featured-image" loading="lazy" />
      <div className="featured-badges">
        <span className="badge badge-dark">Featured</span>
        <span className="badge badge-gold">{deal.discount}</span>
      </div>
      <h3 className="featured-title">{deal.title}</h3>
      <div className="featured-bottom">
        <span className="featured-price">{deal.price}</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const featuredDeals = useMemo(() => deals.filter((deal) => deal.featured).slice(0, 4), []);

  const filteredDeals = useMemo(() => {
    const q = search.trim().toLowerCase();

    return deals.filter((deal) => {
      const matchesCategory = activeCategory === "All" || deal.category === activeCategory;
      const matchesSearch =
        !q ||
        deal.title.toLowerCase().includes(q) ||
        deal.description.toLowerCase().includes(q) ||
        deal.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-gradient-line" />
        <div className="container">
          <div className="announcement-grid">
            {["🍁 Amazon Canada Finds", "🔥 Fresh Daily Deals", "⚡ Big Savings Fast"].map((item) => (
              <div key={item} className="announcement-card">
                {item}
              </div>
            ))}
          </div>

          <div className="hero-grid">
            <div>
              <div className="eyebrow">
                <Flame size={16} />
                Amazon Canada savings in one place
              </div>

              <div className="brand-row">
                <div className="brand-logo-shell">
                  <img src={brand.logo} alt="Maple Deals logo" className="brand-logo" />
                </div>
                <div>
                  <p className="brand-name">Maple Deals</p>
                  <p className="brand-subtitle">
                    <MapPin size={14} />
                    Amazon Canada Savings
                  </p>
                </div>
              </div>

              <h1 className="hero-title">Score the hottest deals before they’re gone.</h1>
              <p className="hero-copy">
                Maple Deals brings you the best Amazon Canada deals in one place — updated daily with top picks, trending finds, and real savings.
              </p>

              <div className="hero-actions">
                <div className="socials">
                  {socials.map((social) => (
                    <IconLink key={social.label} {...social} />
                  ))}
                </div>

                <button type="button" className="primary-cta">
                  <ShoppingBag size={18} />
                  Browse Deals
                </button>

                <button type="button" className="secondary-cta">
                  <Tag size={18} />
                  New Deals Daily
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <p>Deals Posted</p>
                  <strong>Daily</strong>
                </div>
                <div className="stat-card">
                  <p>Categories</p>
                  <strong>9+</strong>
                </div>
                <div className="stat-card">
                  <p>Savings</p>
                  <strong>Up to 54%</strong>
                </div>
              </div>
            </div>

            <div className="featured-panel-wrap">
              <div className="top-picks-label">Top Picks</div>

              <div className="featured-panel">
                <div className="featured-header">
                  <div>
                    <p>Featured This Week</p>
                    <h2>Maple Deals Hot List</h2>
                  </div>
                  <Star size={18} />
                </div>

                <div className="featured-grid">
                  {featuredDeals.map((deal) => (
                    <FeaturedCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container content-section">
        <div className="spotlight-grid">
          {[
            { title: "Top Tech Deals", text: "Trending gadgets, PC finds, and smart buys.", tone: "warm" },
            { title: "Home & Office", text: "Useful everyday picks for your space.", tone: "light" },
            { title: "Pet & Lifestyle", text: "Fun finds, cozy buys, and popular picks.", tone: "gold" },
          ].map((item) => (
            <div key={item.title} className={`spotlight-card ${item.tone}`}>
              <p>Category Spotlight</p>
              <h3>{item.title}</h3>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="search-panel">
          <div>
            <h2>Latest Deals</h2>
            <p>Browse deals by category to quickly find exactly what you’re looking for.</p>
          </div>

          <label className="search-input-wrap" aria-label="Search deals">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals..."
            />
          </label>
        </div>

        <div className="category-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "category-pill active" : "category-pill"}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="latest-strip">
          <Zap size={16} />
          <span>Browse the latest Maple Deals picks</span>
        </div>

        <div className="deals-grid">
          {filteredDeals.length ? (
            filteredDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
          ) : (
            <div className="empty-state">
              <strong>No deals found</strong>
              <p>Try another search or category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="container footer-wrap">
        <div className="footer-banner">
          <div>
            <p className="footer-eyebrow">Ready to grow</p>
            <h2>Turn your Instagram deal posts into a full shopping website.</h2>
            <span>
              This plain Vite version keeps your Maple Deals brand feel while making the site much easier to deploy online.
            </span>
          </div>

          <div className="footer-card">
            <p>Next steps to build out</p>
            <ul>
              <li>Replace any placeholder messaging with your final launch copy</li>
              <li>Connect analytics and social previews</li>
              <li>Add a custom domain in Vercel</li>
              <li>Set up ongoing deal updates from a CSV or Google Sheet later</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

