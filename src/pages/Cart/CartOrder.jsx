import { formatPrice } from '@/helpers/formatPrice'
import React from 'react'

const CartOrder = ({ products = [] }) => {
    return (
        <div className="w-full my-4 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            {products?.map((item, index) => (
                <div
                    key={`cart-item-modal-${index}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4"
                >
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-shrink-0">
                            <img
                                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
                                src={item?.image}
                                alt={item.name}
                            />
                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                x{item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-800 truncate-2-lines">
                                {item.name}
                            </h3>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs md:text-sm text-gray-500">
                                    Đơn giá: {formatPrice(item.price)}đ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CartOrder
