import { groq } from "next-sanity";

export const AI_DEMO_SAMPLES_QUERY = groq`
  *[_type == "ai-demo-sample"] | order(_createdAt desc){
    _id,
    _type,
    title,
    meetingContext,
    persona,
    sourceType,
    transcript,
    audio{
      asset->{
        _id,
        url,
        mimeType,
        size,
        originalFilename
      }
    },
    expectedSummary,
    expectedActionItems,
    demoTips,
    _createdAt,
    _updatedAt
  }
`;

export const AI_DEMO_SAMPLE_QUERY = groq`
  *[_type == "ai-demo-sample" && _id == $id][0]{
    _id,
    _type,
    title,
    meetingContext,
    persona,
    sourceType,
    transcript,
    audio{
      asset->{
        _id,
        url,
        mimeType,
        size,
        originalFilename
      }
    },
    expectedSummary,
    expectedActionItems,
    demoTips,
    _createdAt,
    _updatedAt
  }
`;

