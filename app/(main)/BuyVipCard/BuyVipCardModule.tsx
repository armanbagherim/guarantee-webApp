'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import VipCard from './Vip';
import DiscountCode from './DiscountCode';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/app/components/admin-components/fetcher';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BuyVipCardModule({ session, vipCards, paymentGateways }: { session: any, vipCards: any[], paymentGateways: any[] }) {
    const [selectedCardId, setSelectedCardId] = useState(vipCards[0]?.id || null);
    const swiperRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [selectedGateway, setSelectedGateway] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [discountData, setDiscountData] = useState<any>(null);
    const router = useRouter();

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
            const requestBody: any = {
                vipBundleTypeId: selectedCardId,
                paymentGatewayId: selectedGateway
            };
            
            if (discountData) {
                requestBody.discountCode = discountData.discountCode;
            }
            
            const res = await fetcher({
                method: "POST",
                url: '/v1/api/guarantee/client/payVipBundles',
                body: requestBody
            });
            router.push(res.result.redirectUrl);
        } catch (error) {
            console.log(error);
            alert("خطا در پرداخت. لطفاً مجدداً تلاش کنید");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!swiperRef.current) return;

        const swiper = swiperRef.current;

        const updateNavState = () => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
        };

        swiper.on("slideChange", updateNavState);
        swiper.on("reachEnd", updateNavState);
        swiper.on("reachBeginning", updateNavState);

        updateNavState();
    }, []);

    return (
        <div className="mx-auto p-4 relative max-w-6xl">
            <div className="relative bg-white rounded-3xl p-4">

                {/* Navigation Buttons */}
                <button
                    ref={navigationPrevRef}
                    disabled={isBeginning}
                    className={`absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition 
                        ${isBeginning ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                <button
                    ref={navigationNextRef}
                    disabled={isEnd}
                    className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition 
                        ${isEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                    }}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setTimeout(() => {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                            swiper.navigation.init();
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
                    {vipCards.map((card, index) => (
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
                    ))}
                </Swiper>
            </div>

            <DiscountCode 
                vipBundleTypeId={selectedCardId}
                onDiscountApplied={(data) => setDiscountData(data)}
                onDiscountRemoved={() => setDiscountData(null)}
            />

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

            <button
                className='bg-primary text-white px-4 items-center justify-center gap-2 flex py-4 rounded-xl w-full text-center'
                onClick={paymentAdditionalPackage}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال پردازش...
                    </>
                ) : (
                    'پرداخت'
                )}
            </button>
        </div>
    );
}
