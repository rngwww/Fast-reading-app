import React from "react";

export const PhoneFrame: React.FC<{
  width?: number;
  height?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  notch?: boolean;
}> = ({ width = 560, height = 1180, children, style, notch = true }) => {
  const borderRadius = Math.round(width * 0.11);
  const borderWidth = Math.round(width * 0.024);
  const screenRadius = borderRadius - borderWidth;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        background: "#18181C",
        borderRadius,
        padding: borderWidth,
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.08), 0 0 0 4px #282830, 0 35px 70px -15px rgba(0,0,0,0.45)",
        boxSizing: "border-box",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Phone Screen */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: screenRadius,
          overflow: "hidden",
          position: "relative",
          background: "#08080A",
        }}
      >
        {/* Dynamic Island / Notch */}
        {notch && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: width * 0.26,
              height: 24,
              borderRadius: 14,
              background: "#000000",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#0D1117",
                border: "1px solid #1E222A",
              }}
            />
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#0D1117",
              }}
            />
          </div>
        )}

        {/* Status Bar */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 28,
            right: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            zIndex: 90,
            pointerEvents: "none",
          }}
        >
          <span>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11 }}>
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Screen Content */}
        {children}

        {/* Glass reflection sheen */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 30%, transparent 55%)",
            pointerEvents: "none",
            zIndex: 105,
          }}
        />

        {/* Home Indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.35,
            height: 4,
            borderRadius: 3,
            background: "rgba(255,255,255,0.35)",
            zIndex: 100,
          }}
        />
      </div>
    </div>
  );
};
