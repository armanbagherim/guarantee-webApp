'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import VipCard from './Vip';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/app/components/admin-components/fetcher';

export default function BuyVipCardModule({ session, vipCards, paymentGateways }) {
    const [selectedCardId, setSelectedCardId] = useState(vipCards[0]?.id || null);
    const swiperRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [selectedGateway, setSelectedGateway] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const transformCardData = (card) => ({
        id: card.id.toString(),
        serialNumber: `#${card.id.toString().padStart(4, '0')}`,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + card.monthPeriod)).toISOString(),
        vipBundleTypeId: card.id,
        totalCredit: card.price,
        availableCredit: card.price,
        vipBundleType: {
            id: card.id,
            cardColor: card.cardColor
        }
    });

    const handleSlideClick = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
            setSelectedCardId(vipCards[index].id);
        }
    };

    const paymentAdditionalPackage = async () => {
        if (!selectedGateway) {
            alert("لطفاً درگاه پرداخت را انتخاب کنید");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetcher({
                method: "POST",
                url: '/v1/api/guarantee/client/payVipBundles',
                body: {
                    vipBundleTypeId: selectedCardId,
                    paymentGatewayId: selectedGateway
                }
            });
            console.log(res);
            router.push(res.result.redirectUrl)
            // Handle successful payment redirection here
        } catch (error) {
            console.log(error);
            alert("خطا در پرداخت. لطفاً مجدداً تلاش کنید");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto p-4 relative max-w-6xl">
            <div className="relative bg-white rounded-3xl p-4">
                <Swiper
                    ref={swiperRef}
                    modules={[Navigation]}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                    }}

                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setTimeout(() => {
                            swiper.navigation.update();
                        });
                    }}
                    onSlideChange={(swiper) => {
                        setSelectedCardId(vipCards[swiper.activeIndex].id);
                    }}
                    centeredSlides={true}
                    spaceBetween={0}
                    slidesPerView={1.5}
                    breakpoints={{
                        640: {
                            slidesPerView: 2.5,
                        },
                        1024: {
                            slidesPerView: 3,
                        }
                    }}
                    className="py-4"
                >
                    {vipCards.map((card, index) => {

                        return (
                            <SwiperSlide key={card.id} onClick={() => handleSlideClick(index)}>
                                <div className={`transition-all duration-300 mx-auto h-full ${selectedCardId === card.id
                                    ? 'scale-100 z-10 transform-gpu'
                                    : 'scale-90 opacity-80 transform-gpu'
                                    }`}>
                                    <VipCard
                                        data={card}
                                        cardName={card.title}
                                    />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            <div className="my-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-bold mb-4 text-right">درگاه پرداخت:</p>
                <div className="grid grid-cols-2 gap-3">
                    {paymentGateways?.map((gateway) => (
                        <button
                            key={gateway.id}
                            onClick={() => setSelectedGateway(gateway.id)}
                            className={`p-3 border rounded-xl transition-all ${selectedGateway === gateway.id
                                ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                                : 'border-gray-300 hover:border-green-300'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Image
                                    src={`/${gateway.icon}`}
                                    alt={gateway.title}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <span>{gateway.title}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <button className='bg-primary text-white px-4 items-center  justify-center gap-2 flex py-4 rounded-xl w-full text-center' onClick={paymentAdditionalPackage}>{isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال پردازش...
                </>
            ) : (
                'پرداخت'
            )}</button>
        </div>
    );
}