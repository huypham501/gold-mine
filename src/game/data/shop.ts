import type { ShopItemConfig } from "@/game/types/shop";

export const SHOP_POOL: ShopItemConfig[] = [
  {
    id: "energy_drink",
    name: "Nước Tăng Lực",
    cost: 220,
    effectType: "pull_speed_mult",
    effectValue: 1.35,
    duration: "next_level",
    description: "Kéo nhanh hơn 35% trong màn kế tiếp.",
  },
  {
    id: "explosive_kit",
    name: "Thuốc Nổ",
    cost: 180,
    effectType: "bomb_stock",
    effectValue: 1,
    duration: "next_level",
    description: "Có 1 lần phá vật phẩm đang kéo (nút B).",
  },
  {
    id: "geology_book",
    name: "Sách Địa Chất",
    cost: 260,
    effectType: "extra_bag_luck",
    effectValue: 0.2,
    duration: "next_level",
    description: "Túi bí ẩn có tỉ lệ trúng cao hơn ở màn kế.",
  },
  {
    id: "lucky_grass",
    name: "Cỏ May Mắn",
    cost: 140,
    effectType: "extra_bag_luck",
    effectValue: 0.1,
    duration: "next_level",
    description: "Tăng nhẹ tỉ lệ túi cho thưởng cao.",
  },
];
