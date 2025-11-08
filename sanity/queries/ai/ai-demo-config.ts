import { groq } from "next-sanity";

export const AI_DEMO_CONFIGS_QUERY = groq`
  *[_type == "ai-demo-config"] | order(_updatedAt desc){
    _id,
    _type,
    title,
    defaultProvider,
    model,
    maxTokens,
    temperature,
    runMode,
    systemPrompt,
    postProcessingInstructions,
    _createdAt,
    _updatedAt
  }
`;

export const AI_DEMO_CONFIG_QUERY = groq`
  *[_type == "ai-demo-config" && _id == $id][0]{
    _id,
    _type,
    title,
    defaultProvider,
    model,
    maxTokens,
    temperature,
    runMode,
    systemPrompt,
    postProcessingInstructions,
    _createdAt,
    _updatedAt
  }
`;

