CREATE TABLE IF NOT EXISTS t_p54427834_mission_dark_store.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    images TEXT[],
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    sizes TEXT[] NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO t_p54427834_mission_dark_store.products (id, name, price, image, images, category, description, sizes, in_stock) VALUES
('1', 'WINDBREAKER BASE IN BLACK «КАКУЛЕШИКОРЕША»', 4500, 
 'https://cdn.poehali.dev/files/035cfbfa-1525-469b-9300-55c518933125.png',
 ARRAY['https://cdn.poehali.dev/files/035cfbfa-1525-469b-9300-55c518933125.png', 'https://cdn.poehali.dev/files/81640857-ba19-41eb-80ea-01f20aab9eb9.png', 'https://cdn.poehali.dev/files/397db817-ca4a-4845-8f2c-b7acc57c2d0c.png'],
 'Куртки',
 'Легкая ветровка из технологичной ткани с защитой от ветра и влаги. Минималистичный дизайн в фирменном стиле Mission By Dark. Состав: 50% нейлон, 50% полиэстер. Размеры могут отличаться на 2-3 см. Изделие может отличаться от фото.',
 ARRAY['S', 'M', 'L', 'XL'],
 true),
('2', 'BOMBER JACKET BASE IN BLACK «КАКУЛЕШИКОРЕША»', 4900,
 'https://cdn.poehali.dev/files/bea965ae-1e12-4730-9ab9-89520e1c8e35.png',
 ARRAY['https://cdn.poehali.dev/files/bea965ae-1e12-4730-9ab9-89520e1c8e35.png', 'https://cdn.poehali.dev/files/feaa756c-1975-4396-b416-be9ffd539572.png', 'https://cdn.poehali.dev/files/397db817-ca4a-4845-8f2c-b7acc57c2d0c.png'],
 'Куртки',
 'Классический бомбер с современной интерпретацией. Плотная ткань, эргономичный крой. Состав: 50% нейлон, 50% полиэстер. Размеры могут отличаться на 2-3 см. Изделие может отличаться от фото.',
 ARRAY['S', 'M', 'L', 'XL'],
 true);