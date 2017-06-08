class Position < ApplicationRecord
  belongs_to :course, foreign_key: 'course_code'
  has_many :assignments
  has_many :preferences

  validates :title, uniqueness: true
end
