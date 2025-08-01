select * from board;

select * from image;

-- alter view board_list_view 
-- as (
-- select b.board_number, title, content, image as title_image, view_count, favorite_count, comment_count, write_datetime, writer_email, nickname as writer_nickname, profile_image as writer_profile_image
-- from user as u, (board as b left join image on board_number));
# delete from image where board_number = 2;

alter table image
rename column image to img_file;

select board_number, any_value(img_file) as img
from image group by board_number;

create view board_list_view 
as (
select 
b.board_number as board_number,
b.title as title,
b.content as content,
i.img as title_image,
b.view_count as view_count,
b.favorite_count as favorite_count,
b.comment_count as comment_count,
b.write_datetime as write_datetime,
b.writer_email as writer_email,
u.nickname as writer_nickname,
u.profile_image as writer_profile_image
from board as b
left join (select board_number, any_value(image) as img
from image group by board_number) as i
on b.board_number = i.board_number
inner join user as u
on b.writer_email = u.email
order by b.write_datetime desc
limit 5 offset 0);

#drop view board_list_view;

select * from board_list_view;

select * from search_log;

-- alter table image rename column img_file to image;

SELECT relation_word as search_word, count(relation_word) as count
FROM search_log
WHERE search_word like '%최신%'
GROUP BY relation_word
ORDER BY count DESC;

insert search_log values (13,"제목", "테스트",1);