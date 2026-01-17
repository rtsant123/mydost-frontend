"use client";

import { useState } from "react";
import { TabsNav } from "./TabsNav";

const houses = [
  { label: "Shillong", value: "shillong" },
  { label: "Khanapara", value: "khanapara" },
  { label: "Jowai", value: "jowai" }
];

export function TeerTabs() {
  const [active, setActive] = useState(houses[0].value);
  return <TabsNav options={houses} value={active} onChange={setActive} />;
}
