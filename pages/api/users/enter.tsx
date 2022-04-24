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

  console.log(user);

  return res.status(200).end();
}

export default withHandler("POST", handler);
