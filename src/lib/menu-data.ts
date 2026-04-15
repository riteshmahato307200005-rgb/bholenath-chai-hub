import masalaChai from "@/assets/menu/masala-chai.jpg";
import kulhadChai from "@/assets/menu/kulhad-chai.jpg";
import samosa from "@/assets/menu/samosa.jpg";
import breadPakora from "@/assets/menu/bread-pakora.jpg";
import vadaPav from "@/assets/menu/vada-pav.jpg";
import coldCoffee from "@/assets/menu/cold-coffee.jpg";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: "tea" | "snacks" | "beverages";
}

export const menuItems: MenuItem[] = [
  {
    id: "masala-chai",
    name: "Masala Chai",
    price: 30,
    description: "Our signature blend with cardamom, ginger & cinnamon",
    image: masalaChai,
    category: "tea",
  },
  {
    id: "kulhad-chai",
    name: "Kulhad Chai",
    price: 40,
    description: "Traditional clay pot chai with earthy aroma",
    image: kulhadChai,
    category: "tea",
  },
  {
    id: "adrak-chai",
    name: "Adrak Chai",
    price: 25,
    description: "Strong ginger tea to warm your soul",
    image: masalaChai,
    category: "tea",
  },
  {
    id: "elaichi-chai",
    name: "Elaichi Chai",
    price: 35,
    description: "Fragrant cardamom-infused classic chai",
    image: kulhadChai,
    category: "tea",
  },
  {
    id: "samosa",
    name: "Samosa",
    price: 20,
    description: "Crispy potato-filled pastry with green chutney",
    image: samosa,
    category: "snacks",
  },
  {
    id: "bread-pakora",
    name: "Bread Pakora",
    price: 25,
    description: "Golden fried bread fritters, crispy & spiced",
    image: breadPakora,
    category: "snacks",
  },
  {
    id: "vada-pav",
    name: "Vada Pav",
    price: 30,
    description: "Mumbai's favorite spiced potato burger",
    image: vadaPav,
    category: "snacks",
  },
  {
    id: "kachori",
    name: "Kachori",
    price: 25,
    description: "Flaky pastry stuffed with spiced lentils",
    image: samosa,
    category: "snacks",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    price: 60,
    description: "Creamy iced coffee blended to perfection",
    image: coldCoffee,
    category: "beverages",
  },
  {
    id: "mango-lassi",
    name: "Mango Lassi",
    price: 50,
    description: "Refreshing yogurt drink with fresh mango",
    image: coldCoffee,
    category: "beverages",
  },
  {
    id: "masala-chaas",
    name: "Masala Chaas",
    price: 30,
    description: "Spiced buttermilk — the perfect digestive drink",
    image: coldCoffee,
    category: "beverages",
  },
  {
    id: "thandai",
    name: "Thandai",
    price: 55,
    description: "Traditional spiced milk with almonds & saffron",
    image: kulhadChai,
    category: "beverages",
  },
];

export const categories = [
  { id: "tea" as const, label: "🍵 Tea", emoji: "🍵" },
  { id: "snacks" as const, label: "🥟 Snacks", emoji: "🥟" },
  { id: "beverages" as const, label: "🥤 Beverages", emoji: "🥤" },
];
