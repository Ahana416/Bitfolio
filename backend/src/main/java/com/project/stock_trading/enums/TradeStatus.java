package com.project.stock_trading.enums;

public enum TradeStatus {
    BUY(0),
    SELL(1),
    ERROR(2);

    private final int code;

    TradeStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static TradeStatus fromCode(int code) {
        for (TradeStatus status : TradeStatus.values()) {
            if (status.code == code) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status code: " + code);
    }
}

// package com.project.stock_trading.enums;

// public enum TradeStatus {
// PENDING(0),
// FILLED(1),
// REJECTED(2);

// private final int code;

// TradeStatus(int code) {
// this.code = code;
// }

// public int getCode() {
// return code;
// }

// public static TradeStatus fromCode(int code) {
// for (TradeStatus status : TradeStatus.values()) {
// if (status.code == code) {
// return status;
// }
// }
// throw new IllegalArgumentException("Invalid status code: " + code);
// }
// }