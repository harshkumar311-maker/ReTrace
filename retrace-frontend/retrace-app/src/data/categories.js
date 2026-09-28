// Central schema: every category, its subcategories, and the field set
// that should render for that subcategory. This is what makes the report
// flow feel like "only the fields relevant to this exact object."
//
// Field types: text, textarea, select, number, date, time, toggle, private-text

const loc = () => ([
  { name: "location", label: "Location", type: "text", placeholder: "e.g. College Library, Sector 29 Metro Station", required: true },
  { name: "landmark", label: "Nearby landmark", type: "text", placeholder: "e.g. Near the food court entrance" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time", label: "Approximate time", type: "time", required: true },
]);

const commonEnd = () => ([
  { name: "description", label: "Description", type: "textarea", placeholder: "Anything else that could help identify this item", required: true },
]);

export const CATEGORIES = [
  {
    id: "electronics",
    label: "Electronics",
    icon: "📱",
    subcategories: [
      {
        id: "phone",
        label: "Phone",
        icon: "📱",
        fields: [
          { name: "brand", label: "Brand", type: "select", options: ["Apple", "Samsung", "OnePlus", "Xiaomi", "Google", "Other"], required: true },
          { name: "model", label: "Model", type: "text", placeholder: "e.g. iPhone 14, Galaxy S23" },
          { name: "color", label: "Color", type: "text", required: true },
          { name: "caseColor", label: "Case color", type: "text" },
          { name: "storage", label: "Storage", type: "select", options: ["64GB", "128GB", "256GB", "512GB", "1TB", "Not sure"] },
          { name: "marks", label: "Distinctive marks", type: "textarea", placeholder: "Cracked corner, sticker, engraving..." },
          { name: "serial", label: "IMEI / Serial number", type: "private-text", helper: "Only shown to you and used to verify a match. Never shown publicly." },
          ...loc(),
          ...commonEnd(),
        ],
      },
      {
        id: "laptop",
        label: "Laptop",
        icon: "💻",
        fields: [
          { name: "brand", label: "Brand", type: "select", options: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Other"], required: true },
          { name: "model", label: "Model", type: "text" },
          { name: "color", label: "Color", type: "text", required: true },
          { name: "os", label: "Operating system", type: "select", options: ["Windows", "macOS", "Linux", "Chrome OS", "Not sure"] },
          { name: "screenSize", label: "Screen size", type: "select", options: ["13\"", "14\"", "15\"", "16\"", "17\"", "Other"] },
          { name: "marks", label: "Distinctive marks", type: "textarea", placeholder: "Stickers, scratches, dents..." },
          { name: "serial", label: "Serial number", type: "private-text", helper: "Only shown to you and used to verify a match. Never shown publicly." },
          { name: "hasBag", label: "Bag included?", type: "toggle" },
          ...loc(),
          ...commonEnd(),
        ],
      },
      {
        id: "earbuds",
        label: "Earbuds / Headphones",
        icon: "🎧",
        fields: [
          { name: "brand", label: "Brand", type: "select", options: ["Apple", "boAt", "Sony", "JBL", "Samsung", "Noise", "Other"], required: true },
          { name: "model", label: "Model", type: "text" },
          { name: "color", label: "Color", type: "text", required: true },
          { name: "type", label: "Type", type: "select", options: ["In-ear (TWS)", "Neckband", "Over-ear headphones", "Wired"] },
          { name: "caseColor", label: "Case color", type: "text" },
          { name: "marks", label: "Distinctive marks", type: "textarea" },
          ...loc(),
          ...commonEnd(),
        ],
      },
      {
        id: "smartwatch",
        label: "Smartwatch",
        icon: "⌚",
        fields: [
          { name: "brand", label: "Brand", type: "select", options: ["Apple", "Samsung", "Noise", "boAt", "Garmin", "Other"], required: true },
          { name: "model", label: "Model", type: "text" },
          { name: "color", label: "Color / strap color", type: "text", required: true },
          { name: "marks", label: "Distinctive marks", type: "textarea" },
          ...loc(),
          ...commonEnd(),
        ],
      },
      {
        id: "camera",
        label: "Camera",
        icon: "📷",
        fields: [
          { name: "brand", label: "Brand", type: "select", options: ["Canon", "Nikon", "Sony", "Fujifilm", "GoPro", "Other"], required: true },
          { name: "model", label: "Model", type: "text" },
          { name: "color", label: "Color", type: "text" },
          { name: "marks", label: "Distinctive marks", type: "textarea" },
          { name: "serial", label: "Serial number", type: "private-text" },
          ...loc(),
          ...commonEnd(),
        ],
      },
      {
        id: "gaming-device",
        label: "Gaming Device",
        icon: "🎮",
        fields: [
          { name: "brand", label: "Brand", type: "select", options: ["Nintendo", "Sony", "Microsoft", "Valve", "Other"], required: true },
          { name: "model", label: "Model", type: "text", placeholder: "e.g. Switch OLED, Steam Deck" },
          { name: "color", label: "Color", type: "text" },
          { name: "marks", label: "Distinctive marks", type: "textarea" },
          ...loc(),
          ...commonEnd(),
        ],
      },
      {
        id: "other-electronic",
        label: "Other Electronic Device",
        icon: "🔌",
        fields: [
          { name: "itemName", label: "What is it?", type: "text", required: true },
          { name: "brand", label: "Brand", type: "text" },
          { name: "color", label: "Color", type: "text" },
          { name: "marks", label: "Distinctive marks", type: "textarea" },
          ...loc(),
          ...commonEnd(),
        ],
      },
    ],
  },
  {
    id: "wallet",
    label: "Wallet / Money",
    icon: "👛",
    subcategories: [
      { id: "wallet", label: "Wallet", icon: "👛" },
      { id: "purse", label: "Purse", icon: "👛" },
      { id: "card-holder", label: "Card Holder", icon: "💳" },
      { id: "cash", label: "Cash", icon: "💵" },
      { id: "other-wallet", label: "Other", icon: "🧾" },
    ].map((s) => ({
      ...s,
      fields: [
        { name: "walletType", label: "Type", type: "text", defaultFrom: "label" },
        { name: "brand", label: "Brand", type: "text" },
        { name: "color", label: "Color", type: "text", required: true },
        { name: "material", label: "Material", type: "select", options: ["Leather", "Fabric", "Synthetic", "Metal", "Not sure"] },
        { name: "marks", label: "Distinctive marks", type: "textarea" },
        { name: "contents", label: "Approximate contents", type: "textarea", placeholder: "e.g. a few cards and some cash — avoid listing exact card numbers", helper: "Please don't enter full card numbers or account details here." },
        ...loc(),
        ...commonEnd(),
      ],
    })),
  },
  {
    id: "bags",
    label: "Bags",
    icon: "🎒",
    subcategories: [
      { id: "backpack", label: "Backpack", icon: "🎒" },
      { id: "laptop-bag", label: "Laptop Bag", icon: "💼" },
      { id: "handbag", label: "Handbag", icon: "👜" },
      { id: "suitcase", label: "Suitcase", icon: "🧳" },
      { id: "pouch", label: "Wallet/Pouch", icon: "👝" },
      { id: "other-bag", label: "Other", icon: "🎒" },
    ].map((s) => ({
      ...s,
      fields: [
        { name: "brand", label: "Brand", type: "text" },
        { name: "bagType", label: "Bag type", type: "text", defaultFrom: "label" },
        { name: "color", label: "Color", type: "text", required: true },
        { name: "size", label: "Size", type: "select", options: ["Small", "Medium", "Large", "Not sure"] },
        { name: "material", label: "Material", type: "text" },
        { name: "marks", label: "Distinctive marks", type: "textarea" },
        { name: "compartments", label: "Number of compartments", type: "number" },
        { name: "contents", label: "Contents", type: "textarea", helper: "General items only — please don't list sensitive personal details." },
        ...loc(),
        ...commonEnd(),
      ],
    })),
  },
  {
    id: "documents",
    label: "Documents",
    icon: "📄",
    subcategories: [
      { id: "id-card", label: "ID Card", icon: "🪪" },
      { id: "driving-license", label: "Driving License", icon: "🪪" },
      { id: "passport", label: "Passport", icon: "🛂" },
      { id: "college-id", label: "College ID", icon: "🎓" },
      { id: "certificate", label: "Certificate", icon: "📜" },
      { id: "bank-card", label: "Bank Card", icon: "💳" },
      { id: "other-document", label: "Other", icon: "📄" },
    ].map((s) => ({
      ...s,
      fields: [
        { name: "documentType", label: "Document type", type: "text", defaultFrom: "label" },
        { name: "issuer", label: "Issuing organization", type: "text" },
        { name: "nameOnDocument", label: "Name on document", type: "text" },
        { name: "validity", label: "Approximate issue/expiry info", type: "text", placeholder: "If it helps identify the document" },
        { name: "documentNumber", label: "Document number", type: "private-text", helper: "Kept private and used only to verify a match. Never shown publicly." },
        ...loc(),
        { name: "description", label: "Description", type: "textarea", required: true },
      ],
    })),
  },
  {
    id: "keys",
    label: "Keys",
    icon: "🔑",
    subcategories: [
      { id: "house-key", label: "House Key", icon: "🔑" },
      { id: "vehicle-key", label: "Car/Bike Key", icon: "🔑" },
      { id: "office-key", label: "Office Key", icon: "🔑" },
      { id: "keychain", label: "Keychain", icon: "🔑" },
      { id: "other-key", label: "Other", icon: "🔑" },
    ].map((s) => ({
      ...s,
      fields: [
        { name: "keyType", label: "Key type", type: "text", defaultFrom: "label" },
        { name: "numberOfKeys", label: "Number of keys", type: "number" },
        { name: "keychainDescription", label: "Keychain description", type: "text" },
        { name: "color", label: "Color", type: "text" },
        { name: "marks", label: "Distinctive marks", type: "textarea" },
        ...loc(),
        { name: "description", label: "Description", type: "textarea", required: true },
      ],
    })),
  },
  {
    id: "jewelry",
    label: "Jewelry",
    icon: "💍",
    subcategories: [
      { id: "ring", label: "Ring", icon: "💍" },
      { id: "necklace", label: "Necklace", icon: "📿" },
      { id: "bracelet", label: "Bracelet", icon: "💫" },
      { id: "earrings", label: "Earrings", icon: "💎" },
      { id: "jewelry-watch", label: "Watch", icon: "⌚" },
      { id: "other-jewelry", label: "Other", icon: "💍" },
    ].map((s) => ({
      ...s,
      fields: [
        { name: "type", label: "Type", type: "text", defaultFrom: "label" },
        { name: "material", label: "Material", type: "select", options: ["Gold", "Silver", "Platinum", "Fashion / imitation", "Not sure"] },
        { name: "color", label: "Color", type: "text" },
        { name: "brand", label: "Brand", type: "text" },
        { name: "size", label: "Approximate size", type: "text" },
        { name: "marks", label: "Distinctive marks", type: "textarea" },
        ...loc(),
        { name: "description", label: "Description", type: "textarea", required: true },
      ],
    })),
  },
  {
    id: "clothing",
    label: "Clothing",
    icon: "👕",
    subcategories: [
      { id: "jacket", label: "Jacket", icon: "🧥" },
      { id: "hoodie", label: "Hoodie", icon: "👕" },
      { id: "shirt", label: "Shirt", icon: "👔" },
      { id: "tshirt", label: "T-Shirt", icon: "👕" },
      { id: "shoes", label: "Shoes", icon: "👟" },
      { id: "cap", label: "Cap", icon: "🧢" },
      { id: "other-clothing", label: "Other", icon: "👕" },
    ].map((s) => ({
      ...s,
      fields: [
        { name: "clothingType", label: "Clothing type", type: "text", defaultFrom: "label" },
        { name: "brand", label: "Brand", type: "text" },
        { name: "size", label: "Size", type: "text" },
        { name: "color", label: "Color", type: "text", required: true },
        { name: "material", label: "Material", type: "text" },
        { name: "pattern", label: "Pattern", type: "text" },
        { name: "marks", label: "Distinctive marks", type: "textarea" },
        ...loc(),
        { name: "description", label: "Description", type: "textarea", required: true },
      ],
    })),
  },
  {
    id: "books",
    label: "Books",
    icon: "📚",
    subcategories: [
      {
        id: "book",
        label: "Book",
        icon: "📚",
        fields: [
          { name: "title", label: "Book title", type: "text", required: true },
          { name: "author", label: "Author", type: "text" },
          { name: "edition", label: "Edition", type: "text" },
          { name: "publisher", label: "Publisher", type: "text" },
          { name: "coverColor", label: "Cover color", type: "text" },
          { name: "marks", label: "Personal markings", type: "textarea", placeholder: "Name written inside, highlights, folded pages..." },
          ...loc(),
          { name: "description", label: "Description", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: "🎮",
    subcategories: [
      {
        id: "gaming-item",
        label: "Gaming item",
        icon: "🎮",
        fields: [
          { name: "itemName", label: "Item name", type: "text", required: true },
          { name: "brand", label: "Brand", type: "text" },
          { name: "color", label: "Color", type: "text" },
          { name: "marks", label: "Distinctive marks", type: "textarea" },
          ...loc(),
          { name: "description", label: "Description", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: "🧸",
    subcategories: [
      {
        id: "other-item",
        label: "Item",
        icon: "🧸",
        fields: [
          { name: "itemName", label: "Item name", type: "text", required: true },
          { name: "itemCategory", label: "Item category", type: "text" },
          { name: "brand", label: "Brand", type: "text" },
          { name: "color", label: "Color", type: "text" },
          { name: "marks", label: "Distinctive features", type: "textarea" },
          ...loc(),
          { name: "description", label: "Description", type: "textarea", required: true },
        ],
      },
    ],
  },
];

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
export const getSubcategory = (categoryId, subId) =>
  getCategory(categoryId)?.subcategories.find((s) => s.id === subId);
