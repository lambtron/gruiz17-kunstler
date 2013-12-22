require 'date'
require 'chronic'

class Time
  def to_datetime
    seconds = sec + Rational(usec, 10**6)
    offset = Rational(utc_offset, 60 * 60 * 24)
    DateTime.new(year, month, day, hour, min, seconds, offset)
  end
end
	
class Committer
	class << self
		private
		def get_earliest_sunday
			last_year = Date.new(Date.today.year - 1, Date.today.month, Date.today.day)
			sunday = Chronic.parse('next sunday', :now => last_year)
			return sunday.to_datetime
		end

		def get_latest_saturday
			return Chronic.parse('last saturday').to_datetime
		end

		def dates
			get_earliest_sunday.upto(get_latest_saturday).to_a
		end
	end

	def self.get_dates_to_commit(pattern)
		commit_dates = []
		i = 0
		pattern.each_char do |c|
			if (c == "1")
				22.times do |j|
					commit_dates << dates[j].to_time + j*3600
				end
			end
		end
		return commit_dates
	end

	def self.actual_commit(dates)
		dates.each do |date|
			puts "committing! on "
			puts date
			letters = ['a','b','c','d','e','f','g','h']
			f = File.open('dummy', 'w') {|f| f << letters.shuffle.join('')}
			`GIT_AUTHOR_DATE="#{date}" GIT_COMMITTER_DATE="#{date}" git commit -am "changed on #{date}"`
		end
	end
end