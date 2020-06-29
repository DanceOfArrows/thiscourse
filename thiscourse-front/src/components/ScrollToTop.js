import React, { useEffect, useState } from "react";

function ScrollToTop() {
    const [visibility, setVisibility] = useState({ visibile: false })

    function toggleVisibility() {
        if (window.pageYOffset > 250) {
            setVisibility({ visible: true })
        } else {
            setVisibility({ visible: false })
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', e => {
            toggleVisibility();
        });

        return () => {
            window.removeEventListener('scroll', e => {
                toggleVisibility();
            });
        }
    }, [visibility.visible]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="scroll-to-top">
            {visibility.visible && (
                <div onClick={() => scrollToTop()} class="fas fa-chevron-up" />
            )}
        </div>
    );
}

export default ScrollToTop;