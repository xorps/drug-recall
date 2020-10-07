CREATE TYPE stock_option AS ENUM('Yes', 'No');

CREATE TABLE IF NOT EXISTS recall (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    date DATE NOT NULL,
    drug VARCHAR(255) NOT NULL,
    mfgr VARCHAR(255) NOT NULL,
    lot VARCHAR(255) NOT NULL,
    stocked stock_option NOT NULL,
    affected stock_option NOT NULL,
    date_removed DATE NOT NULL,
    initials VARCHAR(255) NOT NULL
);