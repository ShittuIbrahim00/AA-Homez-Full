"use client";

import React from "react";
import { parsePrice } from "./ParsePrice";

interface Props {
  properties: any[];
}

export default function TransactionsTable({ properties }: Props) {
  const soldProps = properties.filter((p) => (p.listingStatus || "").toLowerCase() === "sold");

  return (
    <div className="bg-white shadow p-4 rounded-lg border overflow-x-auto">
      <h4 className="mb-4 font-semibold">Transactions</h4>
      {soldProps.length === 0 ? (
        <div className="text-gray-500">No transactions yet.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Property Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {soldProps.map((p) => (
              <tr key={p.pid}>
                <td className="px-4 py-2 text-sm text-gray-700">{p.name}</td>
                <td className="px-4 py-2 text-sm text-gray-700">₦{parsePrice(p.price).toLocaleString()}</td>
                <td
                  className={`px-4 py-2 text-sm font-medium ${
                    (p.paymentStatus || "pending").toLowerCase() === "paid"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {p.paymentStatus || "Pending"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}