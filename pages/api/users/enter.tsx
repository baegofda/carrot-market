import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  const payload = phone ? { phone: +phone } : { email };
  const user = await client.user.upsert({
    where: {
      // 번호로찾고
      ...payload,
    },
    create: {
      // 없으면 생성
      name: "Anonymous",
      ...payload,
    },
    // 있을때 업데이트는
    update: {},
  });

  const token = await client.token.create({
    data: {
      payload: "5242423",
      user: {
        // connect: 새로운 토큰을 이미 있는 유저와 연결
        // create : 새로운 토큰을 만들면서 새로운 user도 만듬
        // connectOrCreate : 유저를 찾고 있으면 토큰과 커넥트하고 없으면 생성해줌
        connectOrCreate: {
          where: {
            ...payload,
          },
          create: {
            name: "Anonymous",
            ...payload,
          },
        },
      },
    },
  });

  console.log(token);

  return res.status(200).end();
}

export default withHandler("POST", handler);
