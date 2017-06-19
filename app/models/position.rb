class Position < ApplicationRecord
  has_many :assignments
  has_many :preferences

  validates :title, uniqueness: true
end
