import client from "../db.ts";

export async function generateFluctuations(id: number): Promise<void> {
  await client.queryArray(
    `INSERT INTO investment_fluctuations (user_investment_id, percentage)
      VALUES 
        ($ID, 10.3),
        ($ID, -5.2),
        ($ID, 10.3)`,
    { id },
  );
}
