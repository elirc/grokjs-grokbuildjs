/*
Example: Prisma Transactions and Relations
*/

const result = await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({
    data: { userId: 1, total: 49.99 }
  });

  await tx.orderItem.createMany({
    data: items.map(i => ({ orderId: order.id, ...i }))
  });

  return order;
});

/*
$transaction with a callback gives you an atomic unit. If any operation inside throws, Prisma rolls back everything.

Notice we pass the tx client into each call instead of the regular prisma client. This ensures all statements participate in the same transaction.

For relations, Prisma lets you create nested records in one go or load them with include/select. Understanding when to use transactions versus simple creates is key to writing correct data access code.

A junior should learn to think "what set of changes must succeed or fail together?" and wrap them in a transaction.
*/
