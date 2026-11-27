export const cart = $state({count: 0})

export function addToCart(quantity = 1) {
  cart.count += quantity
}
