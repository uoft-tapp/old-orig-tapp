class Course < ApplicationRecord
  belongs_to :campus, foreign_key: 'campus_code'
  belongs_to :instructor, optional: true
  has_many :positions
  validates :code, uniqueness: true
end
