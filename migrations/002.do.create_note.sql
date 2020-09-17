CREATE TABLE notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    date_published TIMESTAMPTZ DEFAULT now() NOT NULL,
    folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE
);