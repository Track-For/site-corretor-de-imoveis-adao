"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ overwrite: "auto" });
gsap.ticker.lagSmoothing(500, 33);

export { gsap, ScrollTrigger, useGSAP };
