import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

export const ADMIN_USERS_QUERY = groq`
  *[_type == "admin-user"] | order(fullName asc){
    _id,
    _type,
    fullName,
    email,
    avatar{
      ${imageQuery}
    },
    role,
    status,
    managedCollections,
    notes,
    lastLogin,
    _createdAt,
    _updatedAt
  }
`;

export const ADMIN_USER_QUERY = groq`
  *[_type == "admin-user" && email == $email][0]{
    _id,
    _type,
    fullName,
    email,
    avatar{
      ${imageQuery}
    },
    role,
    status,
    managedCollections,
    notes,
    lastLogin,
    _createdAt,
    _updatedAt
  }
`;

